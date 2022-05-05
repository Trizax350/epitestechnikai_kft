from datetime import date, datetime
from email.headerregistry import Address
from operator import and_
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal
from sqlalchemy.sql import func, extract, literal
from sqlalchemy import desc
import models
import hashlib, os
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

origins = [
    'http://localhost:4200',
    'http://0.0.0.0:4200',
    'http://10.77.1.23:4200',
    'http://containers.eu.ngrok.io',
    'https://containers.eu.ngrok.io'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class Container(BaseModel):
    ID: Optional[int]
    Type: str
    Capacity: int
    Part1: str
    Part2: str
    Part3: str
    Part4: str
    Stock: int
    Monetary_value: float
    Last_updated: Optional[datetime]

    class Config:
        orm_mode=True

class Delivery(BaseModel):
    ID: Optional[int]
    Customer_ID: int
    Order_date: date
    Container_type: int
    Count: int
    Supplier: str
    Selling_price: float
    Freight_cost: float
    Comment: Optional[str]
    Delivery_date: date

    class Config:
        orm_mode=True

class Order(BaseModel):
    ID: Optional[int]
    Containers_ID: int
    Freight_ID: int
    Ordered_quantity: int
    Revenue_quantity: int
    Monetary_value: float
    Status: Optional[str]

    class Config:
        orm_mode=True

class User(BaseModel):
    ID: Optional[int]
    Name: str
    Email: str
    Password: str
    Status: str

    class Config:
        orm_mode=True

class Customer(BaseModel):
    ID: Optional[int]
    Name: str
    Address: str
    Tax_number: Optional[str]
    Contact_name: Optional[str]
    Contact_email: Optional[str]

    class Config:
        orm_mode=True

class Freight(BaseModel):
    ID: Optional[int]
    Order_date: date
    Transport_date: date

    class Config:
        orm_mode=True

db = SessionLocal()

##Dashboard functions

@app.get('/dashboard_list_ord_rev_all', status_code=200)
def list_containers_ord_rev_all():
    container_ord_rev_all = db.query(
        func.sum(models.Order.Ordered_quantity).label('Ord_all'),
        func.sum(models.Order.Revenue_quantity).label('Rev_all')).all()
    return container_ord_rev_all

@app.get('/dashboard_list_ord_rev_stat', status_code=200)
def list_containers_ord_rev_stat():
    container_ord_rev_stat = db.query(models.Order, models.Container, models.Freight).join(models.Container).join(models.Freight).group_by(models.Freight.ID, models.Order.ID, models.Container.ID).order_by(models.Freight.Transport_date).filter(models.Order.Status != 'Zárt').all()
    return container_ord_rev_stat

@app.get('/dashboard_list_all_delivery', status_code=200)
def list_containers_ord_rev_stat():
    current_date = datetime.today().strftime('%Y-%m-%d')
    list_all_delivery = db.query(models.Delivery, models.Container, models.Customer).join(models.Container).join(models.Customer).group_by(models.Customer.ID, models.Delivery.ID, models.Container.ID).order_by(models.Delivery.Delivery_date).filter(models.Delivery.Delivery_date > current_date).all()
    return list_all_delivery

@app.get('/dashboard_customer_list', status_code=200)
def list_customer_by_monetary_value():
    current_year = datetime.now()
    sub_customer_list = db.query(
        models.Delivery.Customer_ID, 
        models.Customer,
        func.sum(models.Delivery.Count * models.Delivery.Selling_price).filter(extract('year', models.Delivery.Delivery_date) == current_year.year).label('Sum_val')).group_by(models.Delivery.Customer_ID, models.Customer.ID).join(models.Customer).order_by(desc('Sum_val')).subquery()
    
    customer_list = db.query(sub_customer_list).filter(sub_customer_list.c.Sum_val != None).all()
    return customer_list

@app.get('/dashboard_all_delivery_val', status_code=200)
def list_all_delivery_val():
    current_year = datetime.now()
    sum_by_id = db.query(func.sum(models.Delivery.Count * models.Delivery.Selling_price).label('Sum_all')).group_by(models.Delivery.ID).filter(extract('year', models.Delivery.Delivery_date) == current_year.year).subquery()

    total_value = db.query(func.sum(sum_by_id.c.Sum_all)).scalar()
    return total_value

@app.get('/dashboard_all_delivery_count', status_code=200)
def list_all_delivery_count():
    current_year = datetime.now()
    total_count = db.query(func.sum(models.Delivery.Count).label('Sum_all_count')).filter(extract('year', models.Delivery.Delivery_date) == current_year.year).scalar()
    return total_count

##Stock functions

@app.get('/stock_list_all', status_code=200)
def list_stock():
    current_date = datetime.today().strftime('%Y-%m-%d')
    #.filter(models.Delivery.Delivery_date <= current_date)
    #.filter(models.Freight.Transport_date <= current_date) nem is a current date-től kell nézni...

    delivery = db.query(
        models.Container,
        models.Delivery.Container_type,
        models.Order.Containers_ID,
        func.sum(models.Delivery.Count).label('Container_count'),
        func.sum(models.Order.Revenue_quantity).label('Rev_all')).select_from(models.Container).outerjoin(models.Delivery).outerjoin(models.Order).group_by(models.Container.ID, models.Delivery.Container_type, models.Order.Containers_ID).order_by(models.Container.ID).all()
    return delivery

##Inventory functions

@app.get('/inventory_list_all', response_model=List[Container], status_code=200)
def list_inventory():
    containers = db.query(models.Container).order_by(models.Container.ID).all()
    return containers

@app.get('/inventory_get_by_id/{item_id}', response_model=Container, status_code=status.HTTP_200_OK)
def get_inventory_item_by_id(item_id: int):
    container = db.query(models.Container).filter(models.Container.ID == item_id).first()
    return container

@app.post('/inventory_post', response_model=Container, status_code=status.HTTP_201_CREATED)
def add_item_to_inventory(container: Container):
    db_container = db.query(models.Container).filter(models.Container.ID == container.ID).first()

    if db_container is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a tartály azonosító már létezik.")

    check_new_container = db.query(models.Container).filter(
        models.Container.Type == container.Type,
        models.Container.Capacity == container.Capacity,
        models.Container.Part1 == container.Part1,
        models.Container.Part2 == container.Part2,
        models.Container.Part3 == container.Part3,
        models.Container.Part4 == container.Part4).first()

    if check_new_container is not None:
        raise HTTPException(status_code=400, detail="Hiba: Ez a tartály típus már létezik.")

    new_container = models.Container(
        ID = container.ID,
        Type = container.Type,
        Capacity = container.Capacity,
        Part1 = container.Part1,
        Part2 = container.Part2,
        Part3 = container.Part3,
        Part4 = container.Part4,
        Stock = container.Stock,
        Monetary_value = container.Monetary_value,
        Last_updated = datetime.now()
    )

    db.add(new_container)
    db.commit()

    return new_container

@app.put('/inventory_update_by_id/{item_id}', response_model=Container, status_code=status.HTTP_200_OK)
def update_inventory_item_by_id(item_id: int, container: Container):
    check_update_container = db.query(models.Container).filter(
        models.Container.ID != item_id,
        models.Container.Type == container.Type,
        models.Container.Capacity == container.Capacity,
        models.Container.Part1 == container.Part1,
        models.Container.Part2 == container.Part2,
        models.Container.Part3 == container.Part3,
        models.Container.Part4 == container.Part4).first()

    if check_update_container is not None:
        raise HTTPException(status_code=400, detail="Hiba: Ez a tartály típus már létezik.")

    item_to_update = db.query(models.Container).filter(models.Container.ID == item_id).first()
    item_to_update.Type = container.Type
    item_to_update.Capacity = container.Capacity
    item_to_update.Part1 = container.Part1
    item_to_update.Part2 = container.Part2
    item_to_update.Part3 = container.Part3
    item_to_update.Part4 = container.Part4
    item_to_update.Stock = container.Stock
    item_to_update.Monetary_value = container.Monetary_value
    item_to_update.Last_updated = datetime.now()

    db.commit()
    return item_to_update

@app.delete('/inventory_delete_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item_by_id(item_id: int):
    item_to_delete = db.query(models.Container).filter(models.Container.ID == item_id).first()
    item_to_check_orders = db.query(models.Order).filter(models.Order.Containers_ID == item_id).first()
    item_to_check_delivery = db.query(models.Delivery).filter(models.Delivery.Container_type == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Tartály azonosító nem található.")

    if item_to_check_orders is not None:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Hiba: A tartály azonosító szerepel a rendelés táblában, ezért nem törölhető.")

    if item_to_check_delivery is not None:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Hiba: A tartály azonosító szerepel a kiszállítás táblában, ezért nem törölhető.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##Delivery functions

@app.get('/delivery_list_all', status_code=200)
def list_delivery():
    delivery = db.query(models.Delivery, models.Container, models.Customer).join(models.Container).join(models.Customer).order_by(models.Delivery.ID).all()
    return delivery

@app.get('/delivery_get_by_id/{item_id}', status_code=status.HTTP_200_OK)
def get_delivery_item_by_id(item_id: int):
    delivery = db.query(models.Delivery, models.Container, models.Customer).join(models.Container).join(models.Customer).filter(models.Delivery.ID == item_id).first()
    return delivery

@app.post('/delivery_post', response_model=Delivery, status_code=status.HTTP_201_CREATED)
def add_item_to_delivery(delivery: Delivery):
    db_delivery = db.query(models.Delivery).filter(models.Delivery.ID == delivery.ID).first()

    if db_delivery is not None:
       raise HTTPException(status_code=400, detail="Hiba: Kiszállítás azonosító már létezik.")

    if(delivery.Order_date > delivery.Delivery_date):
        raise HTTPException(status_code=400, detail="Hiba: A rendelés ideje nem lehet későbbi, mint a szállítás ideje.")

    new_delivery = models.Delivery(
        ID = delivery.ID,
        Customer_ID = delivery.Customer_ID,
        Order_date = delivery.Order_date,
        Container_type = delivery.Container_type,
        Count = delivery.Count,
        Supplier = delivery.Supplier,
        Selling_price = delivery.Selling_price,
        Freight_cost = delivery.Freight_cost,
        Comment = delivery.Comment,
        Delivery_date = delivery.Delivery_date
    )

    db.add(new_delivery)
    db.commit()

    return new_delivery

@app.put('/delivery_update_by_id/{item_id}', response_model=Delivery, status_code=status.HTTP_200_OK)
def update_delivery_item_by_id(item_id: int, delivery: Delivery):
    if(delivery.Order_date > delivery.Delivery_date):
        raise HTTPException(status_code=400, detail="Hiba: A rendelés ideje nem lehet későbbi, mint a szállítás ideje.")

    item_to_update = db.query(models.Delivery).filter(models.Delivery.ID == item_id).first()
    item_to_update.Customer_ID = delivery.Customer_ID
    item_to_update.Order_date = delivery.Order_date
    item_to_update.Container_type = delivery.Container_type
    item_to_update.Count = delivery.Count
    item_to_update.Supplier = delivery.Supplier
    item_to_update.Selling_price = delivery.Selling_price
    item_to_update.Freight_cost = delivery.Freight_cost
    item_to_update.Comment = delivery.Comment
    item_to_update.Delivery_date = delivery.Delivery_date

    db.commit()
    return item_to_update

@app.delete('/delivery_delete_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_delivery_item_by_id(item_id: int):
    item_to_delete = db.query(models.Delivery).filter(models.Delivery.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Kiszállítás nem található.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##Order functions

@app.get('/order_list_all', status_code=200)
def list_order():
    order = db.query(models.Order, models.Freight, models.Container).join(models.Freight).join(models.Container).order_by(models.Order.ID).all()
    return order

@app.get('/order_get_by_id/{item_id}', status_code=status.HTTP_200_OK)
def get_order_item_by_id(item_id: int):
    order = db.query(models.Order, models.Freight, models.Container).join(models.Freight).join(models.Container).filter(models.Order.ID == item_id).first()
    return order

@app.post('/order_post', response_model=Order, status_code=status.HTTP_201_CREATED)
def add_item_to_order(order: Order):
    db_order = db.query(models.Order).filter(models.Order.ID == order.ID).first()

    if db_order is not None:
       raise HTTPException(status_code=400, detail="Hiba: Rendelés azonosító már létezik.")

    check_new_order = db.query(models.Order).filter(
        models.Order.Containers_ID == order.Containers_ID,
        models.Order.Freight_ID == order.Freight_ID).first()

    if check_new_order is not None:
        raise HTTPException(status_code=400, detail="Hiba: Ehhez a rendeléshez már hozzá lett rendelve ez a tartály típus.")

    if(order.Revenue_quantity > order.Ordered_quantity):
        raise HTTPException(status_code=400, detail="Hiba: Bevételezett mennyiség hibás érték.")

    if(order.Revenue_quantity > 0) and (order.Revenue_quantity < order.Ordered_quantity):
        order.Status = "Részleges"
    elif(order.Revenue_quantity == order.Ordered_quantity):
        order.Status = "Zárt"
    else:
        order.Status = "Nyitott"

    new_order = models.Order(
        ID = order.ID,
        Containers_ID = order.Containers_ID,
        Freight_ID = order.Freight_ID,
        Ordered_quantity = order.Ordered_quantity,
        Revenue_quantity = order.Revenue_quantity,
        Monetary_value = order.Monetary_value,
        Status = order.Status
    )

    db.add(new_order)
    db.commit()

    return new_order

@app.put('/order_update_by_id/{item_id}', response_model=Order, status_code=status.HTTP_200_OK)
def update_order_item_by_id(item_id: int, order: Order):
    if(order.Revenue_quantity > order.Ordered_quantity):
        raise HTTPException(status_code=400, detail="Hiba: Bevételezett mennyiség hibás érték.")

    if(order.Revenue_quantity > 0) and (order.Revenue_quantity < order.Ordered_quantity):
        order.Status = "Részleges"
    elif(order.Revenue_quantity == order.Ordered_quantity):
        order.Status = "Zárt"
    else:
        order.Status = "Nyitott"

    item_to_update = db.query(models.Order).filter(models.Order.ID == item_id).first()
    item_to_update.Containers_ID = order.Containers_ID
    item_to_update.Freight_ID = order.Freight_ID
    item_to_update.Ordered_quantity = order.Ordered_quantity
    item_to_update.Revenue_quantity = order.Revenue_quantity
    item_to_update.Monetary_value = order.Monetary_value
    item_to_update.Status = order.Status

    db.commit()
    return item_to_update

@app.delete('/order_delete_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_order_item_by_id(item_id: int):
    item_to_delete = db.query(models.Order).filter(models.Order.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Rendelés tétel nem található.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##User functions
salt = os.urandom(32)

@app.get('/user_list_all', response_model=List[User], status_code=200)
def list_user():
    user = db.query(models.User).order_by(models.User.ID).all()
    return user

@app.get('/user_get_by_id/{item_id}', response_model=User, status_code=status.HTTP_200_OK)
def get_user_item_by_id(item_id: int):
    user = db.query(models.User).filter(models.User.ID == item_id).first()
    return user

@app.post('/user_post', response_model=User, status_code=status.HTTP_201_CREATED)
def add_item_to_user(user: User):
    db_user = db.query(models.User).filter(models.User.ID == user.ID).first()

    if db_user is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a felhasználó azonosító már létezik.")

    user_check_email = db.query(models.User).filter(models.User.Email == user.Email).first()

    if user_check_email is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez az e-mail cím már foglalt.")

    new_user = models.User(
        ID = user.ID,
        Name = user.Name,
        Email = user.Email,
        Password = hashlib.pbkdf2_hmac(
        'sha256', # The hash digest algorithm for HMAC
        user.Password.encode('utf-8'), # Convert the password to bytes
        salt, # Provide the salt
        100000 # It is recommended to use at least 100,000 iterations of SHA-256 
        ),
        Status = user.Status
    )

    db.add(new_user)
    db.commit()

    return new_user

@app.put('/user_update_by_id/{item_id}', response_model=User, status_code=status.HTTP_200_OK)
def update_user_item_by_id(item_id: int, user: User):
    user_check_email = db.query(models.User).filter(models.User.Email == user.Email).first()

    if user_check_email is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez az e-mail cím már foglalt.")

    item_to_update = db.query(models.User).filter(models.User.ID == item_id).first()
    item_to_update.Name = user.Name
    item_to_update.Email = user.Email
    item_to_update.Password = hashlib.pbkdf2_hmac(
    'sha256', # The hash digest algorithm for HMAC
    user.Password.encode('utf-8'), # Convert the password to bytes
    salt, # Provide the salt
    100000 # It is recommended to use at least 100,000 iterations of SHA-256 
    )
    item_to_update.Status = user.Status

    db.commit()
    return item_to_update

@app.delete('/user_delete_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user_item_by_id(item_id: int):
    item_to_delete = db.query(models.User).filter(models.User.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Felhasználó nem található.")

    if item_id == 1 or item_id == 2:
       raise HTTPException(status_code=400, detail="Hiba: Ez a felhasználói fiók nem törölhető.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##Customer functions

@app.get('/customer_list_all', response_model=List[Customer], status_code=200)
def list_customer():
    customer = db.query(models.Customer).order_by(models.Customer.ID).all()
    return customer

@app.get('/customer_get_by_id/{item_id}', response_model=Customer, status_code=status.HTTP_200_OK)
def get_customer_item_by_id(item_id: int):
    customer = db.query(models.Customer).filter(models.Customer.ID == item_id).first()
    return customer

@app.post('/customer_post', response_model=Customer, status_code=status.HTTP_201_CREATED)
def add_item_to_customer(customer: Customer):
    db_customer = db.query(models.Customer).filter(models.Customer.ID == customer.ID).first()

    if db_customer is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a vevő azonosító már létezik.")

    check_customer_name = db.query(models.Customer).filter(models.Customer.Name == customer.Name).first()

    if check_customer_name is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a vevő már létezik.")

    new_customer = models.Customer(
        ID = customer.ID,
        Name = customer.Name,
        Address = customer.Address,
        Tax_number = customer.Tax_number,
        Contact_name = customer.Contact_name,
        Contact_email = customer.Contact_email
    )

    db.add(new_customer)
    db.commit()

    return new_customer

@app.put('/customer_update_by_id/{item_id}', response_model=Customer, status_code=status.HTTP_200_OK)
def update_customer_item_by_id(item_id: int, customer: Customer):
    check_customer_name = db.query(models.Customer).filter(and_(
        models.Customer.ID != item_id,
        models.Customer.Name == customer.Name)).first()

    if check_customer_name is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a vevő már létezik.")

    item_to_update = db.query(models.Customer).filter(models.Customer.ID == item_id).first()
    item_to_update.Name = customer.Name
    item_to_update.Address = customer.Address
    item_to_update.Tax_number = customer.Tax_number
    item_to_update.Contact_name = customer.Contact_name
    item_to_update.Contact_email = customer.Contact_email

    db.commit()
    return item_to_update

@app.delete('/customer_delete_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_customer_item_by_id(item_id: int):
    item_to_delete = db.query(models.Customer).filter(models.Customer.ID == item_id).first()
    item_to_check_delivery = db.query(models.Delivery).filter(models.Delivery.Customer_ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Vevő nem található.")

    if item_to_check_delivery is not None:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Hiba: A vevőhöz tartoznak értékek a kiszállítás táblában, ezért nem törölhető.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete

##Freight functions

@app.get('/freight_list_all', status_code=200)
def list_freight():
    freight = db.query(models.Freight).order_by(models.Freight.ID).all()
    return freight

@app.get('/freight_get_by_id/{item_id}', status_code=status.HTTP_200_OK)
def get_freight_item_by_id(item_id: int):
    freight = db.query(models.Freight).filter(models.Freight.ID == item_id).first()
    return freight

@app.post('/freight_post', response_model=Freight, status_code=status.HTTP_201_CREATED)
def add_item_to_freight(freight: Freight):
    db_freight = db.query(models.Freight).filter(models.Freight.ID == freight.ID).first()

    if db_freight is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a rendelés azonosító már létezik.")

    if(freight.Order_date > freight.Transport_date):
        raise HTTPException(status_code=400, detail="Hiba: A rendelési idő nem lehet később, mint a szállítási idő.")

    new_freight = models.Freight(
        ID = freight.ID,
        Order_date = freight.Order_date,
        Transport_date = freight.Transport_date
    )

    db.add(new_freight)
    db.commit()

    return new_freight

@app.put('/freight_update_by_id/{item_id}', response_model=Freight, status_code=status.HTTP_200_OK)
def update_freight_item_by_id(item_id: int, freight: Freight):
    if(freight.Order_date > freight.Transport_date):
        raise HTTPException(status_code=400, detail="Hiba: A rendelési idő nem lehet később, mint a szállítási idő.")

    item_to_update = db.query(models.Freight).filter(models.Freight.ID == item_id).first()
    item_to_update.Order_date = freight.Order_date
    item_to_update.Transport_date = freight.Transport_date

    db.commit()
    return item_to_update

@app.delete('/freight_delete_by_id/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_freight_item_by_id(item_id: int):
    item_to_delete = db.query(models.Freight).filter(models.Freight.ID == item_id).first()

    if item_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hiba: Rendelés nem található.")

    check_del_freight = db.query(models.Order).filter(
        models.Order.Freight_ID == item_id).first()

    if check_del_freight is not None:
        raise HTTPException(status_code=400, detail="Hiba: A rendelés azonosítóhoz tartoznak értékek, ezért nem törölhető.")

    db.delete(item_to_delete)
    db.commit()
    
    return item_to_delete