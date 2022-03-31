import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { InventoryService } from '../services/inventory.service';
import { FreightService } from '../services/freight.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl} from '@angular/forms';

import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

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
  selector: 'app-editorderdialog',
  templateUrl: './editorderdialog.component.html',
  styleUrls: ['./editorderdialog.component.scss']
})

export class EditOrderDialogComponent implements OnInit {
  date = new FormControl(moment());
  orderForm !: FormGroup;
  actionBtn: string = "Mentés";
  ContainerList: any;
  FreightList: any;
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private OrderService: OrderService, 
    private InventoryService: InventoryService,
    private FreightService: FreightService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditOrderDialogComponent>
  ) { }

  ngOnInit(): void {
    this.InventoryService.getInventory().subscribe((data: any) => {
      this.ContainerList = data;
    })

    this.FreightService.getFreight().subscribe((data: any) => {
      this.FreightList = data;
    })

    this.orderForm = this.formBuilder.group({
        Containers_ID: ['',Validators.required],
        Freight_ID: ['',Validators.required],
        Ordered_quantity: ['',Validators.required],
        Revenue_quantity: ['',Validators.required],
        Monetary_value: ['',Validators.required]
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.orderForm.controls['Containers_ID'].setValue(this.editData.Order.Containers_ID);
        this.orderForm.controls['Freight_ID'].setValue(this.editData.Order.Freight_ID);
        this.orderForm.controls['Ordered_quantity'].setValue(this.editData.Order.Ordered_quantity);
        this.orderForm.controls['Revenue_quantity'].setValue(this.editData.Order.Revenue_quantity);
        this.orderForm.controls['Monetary_value'].setValue(this.editData.Order.Monetary_value);
    }
  }

  addOrderItem(){
    if(!this.editData){
      if(this.orderForm.valid){
        this.OrderService.postOrder(this.orderForm.value).subscribe({
          next:() => {
            alert("Rendelés hozzáadva.");
            this.orderForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateOrderItem()
    }
  }

  updateOrderItem(){
    this.OrderService.putOrder(this.orderForm.value, this.editData.Order.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.orderForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}