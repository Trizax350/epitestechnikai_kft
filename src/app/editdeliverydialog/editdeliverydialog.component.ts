import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { DeliveryService } from '../services/delivery.service';
import { CustomerService } from '../services/customer.service';
import { InventoryService } from '../services/inventory.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl} from '@angular/forms';

import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

interface SealTypeValues {
  value: string;
  viewValue: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-editdeliverydialog',
  templateUrl: './editdeliverydialog.component.html',
  styleUrls: ['./editdeliverydialog.component.scss']
})
export class EditDeliveryDialogComponent implements OnInit {
  date = new FormControl(moment());
  deliveryForm !: FormGroup;
  actionBtn: string = "Mentés";
  CustomerList: any;
  ContainerList: any;
  valid: Date | undefined;
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private CustomerService: CustomerService,
    private DeliveryService: DeliveryService, 
    private InventoryService: InventoryService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditDeliveryDialogComponent>
  ) { }

  ngOnInit(): void {
    this.CustomerService.getCustomer().subscribe((data: any) => {
      this.CustomerList = data;
    })

    this.InventoryService.getInventory().subscribe((data: any) => {
      this.ContainerList = data;
    })

    this.deliveryForm = this.formBuilder.group({
        Customer_ID: ['',Validators.required],
        Order_date: ['',Validators.required], 
        Delivery_date: ['',Validators.required], 
        Container_type: ['',Validators.required], 
        Count: ['',Validators.required], 
        Supplier: ['',Validators.required], 
        Selling_price: ['',Validators.required], 
        Freight_cost: ['',Validators.required], 
        Comment: ['']
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.deliveryForm.controls['Customer_ID'].setValue(this.editData.Customer.ID);
        this.deliveryForm.controls['Order_date'].setValue(this.editData.Delivery.Order_date);
        this.deliveryForm.controls['Delivery_date'].setValue(this.editData.Delivery.Delivery_date);
        this.deliveryForm.controls['Container_type'].setValue(this.editData.Delivery.Container_type);
        this.deliveryForm.controls['Count'].setValue(this.editData.Delivery.Count);
        this.deliveryForm.controls['Supplier'].setValue(this.editData.Delivery.Supplier);
        this.deliveryForm.controls['Selling_price'].setValue(this.editData.Delivery.Selling_price);
        this.deliveryForm.controls['Freight_cost'].setValue(this.editData.Delivery.Freight_cost);
        this.deliveryForm.controls['Comment'].setValue(this.editData.Delivery.Comment);
    }
  }

  changeDatePickerAll(): any {
    this.deliveryForm.value.Order_date = moment(this.deliveryForm.value.Order_date).format('YYYY-MM-DD');
    this.deliveryForm.value.Delivery_date = moment(this.deliveryForm.value.Delivery_date).format('YYYY-MM-DD');
  }

  addDeliveryItem(){
    this.changeDatePickerAll();
    if(!this.editData){
      if(this.deliveryForm.valid){
        this.DeliveryService.postDelivery(this.deliveryForm.value).subscribe({
          next:() => {
            alert("Kiszállítás hozzáadva.");
            this.deliveryForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateDeliveryItem()
    }
  }

  updateDeliveryItem(){
    this.DeliveryService.putDelivery(this.deliveryForm.value, this.editData.Delivery.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.deliveryForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
