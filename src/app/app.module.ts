import { InjectionToken, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

//import * as PlotlyJS from 'plotly.js-dist-min';
//import { PlotlyModule } from 'angular-plotly.js';

//PlotlyModule.plotlyjs = PlotlyJS;

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { InventoryService } from './services/inventory.service';
import { OrderService } from './services/order.service';
import { DeliveryService } from './services/delivery.service';
import { UserService } from './services/user.service';
import { CustomerService } from './services/customer.service';
import { FreightService } from './services/freight.service';
import { DashboardService } from './services/dashborad.service';

import { environment } from 'src/environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditInventoryDialogComponent } from './editinventorydialog/editinventorydialog.component';
import { EditOrderDialogComponent, MY_FORMATS } from './editorderdialog/editorderdialog.component';
import { EditUserDialogComponent } from './edituserdialog/edituserdialog.component';
import { EditDeliveryDialogComponent } from './editdeliverydialog/editdeliverydialog.component';
import { EditCustomerDialogComponent } from './editcustomerdialog/editcustomerdialog.component';
import { EditFreightDialogComponent } from './editfreightdialog/editfreightdialog.component';
import { SaveFreightDialogComponent } from './savefreightdialog/savefreightdialog.component';
import { DelFreightDialogComponent } from './delfreightdialog/delfreightdialog.component';
import { TodolistComponent } from './todolist/todolist.component';
import { StockComponent } from './stock/stock.component';
import { CustomerComponent } from './customer/customer.component';
import { CheckPriceLogDialogComponent } from './checkpricelogdialog/checkpricelogdialog.component';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    EditInventoryDialogComponent,
    EditOrderDialogComponent,
    EditUserDialogComponent,
    EditDeliveryDialogComponent,
    EditCustomerDialogComponent,
    EditFreightDialogComponent,
    TodolistComponent,
    StockComponent,
    CustomerComponent,
    SaveFreightDialogComponent,
    DelFreightDialogComponent,
    CheckPriceLogDialogComponent,
  ],
  entryComponents: [
    EditInventoryDialogComponent,
    EditOrderDialogComponent,
    EditUserDialogComponent,
    EditDeliveryDialogComponent,
    EditCustomerDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    //PlotlyModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    HttpClientModule
  ],
  providers: [ 
    InventoryService,
    OrderService,
    DeliveryService,
    UserService,
    CustomerService,
    FreightService,
    DashboardService,

    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    { provide: API_BASE_URL, useValue: environment.apiRoot },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }