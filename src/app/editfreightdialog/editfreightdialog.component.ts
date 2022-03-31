import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FreightService } from '../services/freight.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

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
  selector: 'app-editfreightdialog',
  templateUrl: './editfreightdialog.component.html',
  styleUrls: ['./editfreightdialog.component.scss']
})
export class EditFreightDialogComponent implements OnInit {
  date = new FormControl(moment());
  freightForm !: FormGroup;
  FreightList: any;
  constructor(
    private http: HttpClient, 
    private FreightService: FreightService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditFreightDialogComponent>
  ) { }

  ngOnInit(): void {
    this.FreightService.getFreight().subscribe((data: any) => {
      this.FreightList = data;
    })

    this.freightForm = this.formBuilder.group({
      ID: [''],
      Order_date: ['',Validators.required],
      Transport_date: ['',Validators.required]
    })
  }

  changeDatePickerAll(): any {
    this.freightForm.value.Order_date = moment(this.freightForm.value.Order_date).format('YYYY-MM-DD');
    this.freightForm.value.Transport_date = moment(this.freightForm.value.Transport_date).format('YYYY-MM-DD');
  }

  updateFreightItem(){
    this.changeDatePickerAll();
    this.FreightService.putFreight(this.freightForm.value, this.freightForm.value.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.freightForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
