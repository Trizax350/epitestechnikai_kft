import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalitycsComponent } from './analitycs/analitycs.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { InventoryComponent } from './inventory/inventory.component';
import { LivemapComponent } from './livemap/livemap.component';
import { OrderComponent } from './order/order.component';
import { StockComponent } from './stock/stock.component';
import { TodolistComponent } from './todolist/todolist.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent},
  { path: 'livemap', component: LivemapComponent},
  { path: 'analitycs', component: AnalitycsComponent},
  { path: 'user_list_all', component: UserComponent},
  { path: 'delivery_list_all', component: DeliveryComponent},
  { path: 'order_list_all', component: OrderComponent},
  { path: 'inventory_list_all', component: InventoryComponent},
  { path: 'stock_list_all', component: StockComponent},
  { path: 'todolist', component: TodolistComponent},
  { path: 'customer_list_all', component: CustomerComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  DashboardComponent, 
  LivemapComponent, 
  AnalitycsComponent,
  DeliveryComponent,
  OrderComponent,
  InventoryComponent,
  StockComponent,
  UserComponent,
  CustomerComponent
]
