from database import Base
from sqlalchemy import Date,DateTime,ForeignKey,String,Integer,Column,Float
from sqlalchemy.sql import func

class Container(Base):
    __tablename__='containers'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Type = Column(String(255), nullable=False)
    Capacity = Column(Integer, nullable=False)
    Part1 = Column(String(255), nullable=False)
    Part2 = Column(String(255), nullable=False)
    Part3 = Column(String(255), nullable=False)
    Part4 = Column(String(255), nullable=False)
    Stock = Column(Integer, nullable=False)
    Monetary_value = Column(Float, nullable=False)
    Last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Delivery(Base):
    __tablename__='delivery'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Customer_ID = Column(Integer, ForeignKey('customers.ID'))
    Order_date = Column(Date, nullable=False)
    Container_type = Column(Integer, ForeignKey('containers.ID'))
    Count = Column(Integer, nullable=False)
    Supplier = Column(String(255), nullable=False)
    Selling_price = Column(Float, nullable=False)
    Freight_cost = Column(Float, nullable=False)
    Comment = Column(String(255), nullable=False)
    Delivery_date = Column(Date, nullable=False)

class Order(Base):
    __tablename__='orders'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Containers_ID = Column(Integer, ForeignKey('containers.ID'))
    Freight_ID = Column(Integer, ForeignKey('freight.ID'))
    Ordered_quantity = Column(Integer, nullable=False)
    Revenue_quantity = Column(Integer, nullable=False)
    Monetary_value = Column(Float, nullable=False)
    Status = Column(String(255), nullable=False)

class User(Base):
    __tablename__='users'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(255), nullable=False)
    Email = Column(String(255), nullable=False)
    Password = Column(String(255), nullable=False)
    Status = Column(String(255), nullable=False)

class Customer(Base):
    __tablename__='customers'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(255), nullable=False)
    Address = Column(String(255), nullable=False)
    Tax_number = Column(String(255), nullable=True)
    Contact_name = Column(String(255), nullable=True)
    Contact_email = Column(String(255), nullable=True)

class Freight(Base):
    __tablename__='freight'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Order_date = Column(Date, nullable=False)
    Transport_date = Column(Date, nullable=False)

class Container_value(Base):
    __tablename__='container_value'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Container_ID = Column(Integer, ForeignKey('containers.ID'))
    Price = Column(Float, nullable=False)
    Date_of_price = Column(DateTime, server_default=func.now(), onupdate=func.now())