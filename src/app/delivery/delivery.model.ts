export interface delivery{
    ID: number;
    Customer_ID: number;
    Order_date: Date;
    Container_type: number;
    Count: number;
    Supplier: string;
    Selling_sprice: number;
    Freight_cost: number;
    Comment: string;
    Delivery_date: Date;
}