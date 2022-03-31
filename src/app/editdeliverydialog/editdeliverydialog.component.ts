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

  SealTypeValues: SealTypeValues[] = [
    {value: 'EPDM', viewValue: 'EPDM'},
    {value: 'PCP', viewValue: 'PCP'},
    {value: 'VITON', viewValue: 'VITON'},
    {value: 'N/A', viewValue: 'N/A'},
  ];

  ngOnInit(): void {
    this.CustomerService.getCustomer().subscribe((data: any) => {
      this.CustomerList = data;
    })

    this.InventoryService.getInventory().subscribe((data: any) => {
      this.ContainerList = data;
    })

    this.deliveryForm = this.formBuilder.group({
        Customer_ID: ['',Validators.required],
        Release_date: ['',Validators.required], 
        Container_type: ['',Validators.required], 
        Seal: ['',Validators.required], 
        Serial_number: ['',Validators.required], 
        Document_number: ['',Validators.required], 
        Production_date: ['',Validators.required], 
        Valid: ['',Validators.required], 
        Comment: ['']
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.deliveryForm.controls['Customer_ID'].setValue(this.editData.Customer.ID);
        this.deliveryForm.controls['Release_date'].setValue(this.editData.Delivery.Release_date);
        this.deliveryForm.controls['Container_type'].setValue(this.editData.Delivery.Container_type);
        this.deliveryForm.controls['Seal'].setValue(this.editData.Delivery.Seal);
        this.deliveryForm.controls['Serial_number'].setValue(this.editData.Delivery.Serial_number);
        this.deliveryForm.controls['Document_number'].setValue(this.editData.Delivery.Document_number);
        this.deliveryForm.controls['Production_date'].setValue(this.editData.Delivery.Production_date);
        this.deliveryForm.controls['Valid'].setValue(this.editData.Delivery.Valid);
        this.deliveryForm.controls['Comment'].setValue(this.editData.Delivery.Comment);
    }
  }

  changeDatePickerAll(): any {
    this.deliveryForm.value.Release_date = moment(this.deliveryForm.value.Release_date).format('YYYY-MM-DD');
    this.deliveryForm.value.Production_date = moment(this.deliveryForm.value.Production_date).format('YYYY-MM-DD');
    this.deliveryForm.value.Valid = moment(this.deliveryForm.value.Valid).format('YYYY-MM-DD');
  }

  changeDatePickerValid(): any {
    const prod = this.deliveryForm.value.Production_date;
    this.valid = new Date(prod.getFullYear() + 2,prod.getMonth() + 6,prod.getDate());
    this.deliveryForm.controls['Valid'].setValue(this.valid);
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
