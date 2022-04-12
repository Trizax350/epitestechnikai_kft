from datetime import date, datetime
from email.headerregistry import Address
from operator import and_
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal
from sqlalchemy.sql import func, literal
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
    Release_date: date
    Container_type: int
    Seal: str
    Serial_number: int
    Document_number: int
    Production_date: date
    Valid: date
    Comment: Optional[str]

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
    container_ord_rev_stat = db.query(
        models.Order.Containers_ID, models.Order.Monetary_value, models.Container,
        func.sum(models.Order.Ordered_quantity).label('Ord'),
        func.sum(models.Order.Revenue_quantity).label('Rev')).join(models.Container).group_by(models.Order.Containers_ID, models.Order.Monetary_value, models.Container).order_by(models.Container.ID).all()
    return container_ord_rev_stat

@app.get('/next_delivery_datas', status_code=200)
def list_next_delivery_datas():
    current_date = datetime.today().strftime('%Y-%m-%d')
    next_delivery_datas = db.query(models.Delivery, models.Container, models.Customer).join(models.Container).join(models.Customer).order_by(models.Delivery.Release_date).filter(models.Delivery.Release_date > current_date).first()
    return next_delivery_datas

@app.get('/next_order_datas', status_code=200)
def list_next_order_datas():
    current_date = datetime.today().strftime('%Y-%m-%d')
    next_order_datas = db.query(models.Order, models.Freight, models.Container).join(models.Freight).join(models.Container).order_by(models.Freight.Transport_date).filter(and_(models.Freight.Transport_date > current_date, models.Order.Status != 'Zárt')).first()
    return next_order_datas

@app.get('/dashboard_customer_list', status_code=200)
def list_customer_by_delivery_count():
    customer_list = db.query(models.Delivery.Customer_ID, models.Customer, func.count(models.Delivery.Customer_ID).label('Count')).join(models.Customer).group_by(models.Delivery.Customer_ID, models.Customer).order_by(desc('Count')).all()
    return customer_list

##Stock functions

@app.get('/stock_list_all', status_code=200)
def list_stock():
    delivery = db.query(
        models.Container,
        models.Delivery.Container_type,
        models.Order.Containers_ID,
        func.count(models.Delivery.Container_type).label('Container_count'),
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

    new_delivery = models.Delivery(
        ID = delivery.ID,
        Customer_ID = delivery.Customer_ID,
        Release_date = delivery.Release_date,
        Container_type = delivery.Container_type,
        Seal = delivery.Seal,
        Serial_number = delivery.Serial_number,
        Document_number = delivery.Document_number,
        Production_date = delivery.Production_date,
        Valid = delivery.Valid,
        Comment = delivery.Comment
    )

    db.add(new_delivery)
    db.commit()

    return new_delivery

@app.put('/delivery_update_by_id/{item_id}', response_model=Delivery, status_code=status.HTTP_200_OK)
def update_delivery_item_by_id(item_id: int, delivery: Delivery):
    item_to_update = db.query(models.Delivery).filter(models.Delivery.ID == item_id).first()
    item_to_update.Customer_ID = delivery.Customer_ID
    item_to_update.Release_date = delivery.Release_date
    item_to_update.Container_type = delivery.Container_type
    item_to_update.Seal = delivery.Seal
    item_to_update.Serial_number = delivery.Serial_number
    item_to_update.Document_number = delivery.Document_number
    item_to_update.Production_date = delivery.Production_date
    item_to_update.Valid = delivery.Valid
    item_to_update.Comment = delivery.Comment

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
        Address = customer.Address
    )

    db.add(new_customer)
    db.commit()

    return new_customer

@app.put('/customer_update_by_id/{item_id}', response_model=Customer, status_code=status.HTTP_200_OK)
def update_customer_item_by_id(item_id: int, customer: Customer):
    check_customer_name = db.query(models.Customer).filter(models.Customer.Name == customer.Name).first()

    if check_customer_name is not None:
       raise HTTPException(status_code=400, detail="Hiba: Ez a vevő már létezik.")

    item_to_update = db.query(models.Customer).filter(models.Customer.ID == item_id).first()
    item_to_update.Name = customer.Name
    item_to_update.Address = customer.Address

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
        raise HTTPException(status_code=400, detail="Hiba: Hibás szállítási idő.")

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
        raise HTTPException(status_code=400, detail="Hiba: Hibás szállítási idő.")

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