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
  selector: 'app-savefreightdialog',
  templateUrl: './savefreightdialog.component.html',
  styleUrls: ['./savefreightdialog.component.scss']
})
export class SaveFreightDialogComponent implements OnInit {
  date = new FormControl(moment());
  freightForm !: FormGroup;
  selectedOption = "";
  constructor(
    private http: HttpClient, 
    private FreightService: FreightService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SaveFreightDialogComponent>
  ) { }

  ngOnInit(): void {
    this.freightForm = this.formBuilder.group({
      Order_date: ['',Validators.required],
      Transport_date: ['',Validators.required]
    })
  }

  changeDatePickerAll(): any {
    this.freightForm.value.Order_date = moment(this.freightForm.value.Order_date).format('YYYY-MM-DD');
    this.freightForm.value.Transport_date = moment(this.freightForm.value.Transport_date).format('YYYY-MM-DD');
  }

  addFreightItem(){
    this.changeDatePickerAll();
    if(this.freightForm.valid){
      this.FreightService.postFreight(this.freightForm.value).subscribe({
        next:(res) => {
          alert("Rendelés hozzáadva.");
          this.freightForm.reset();
          this.dialogRef.close('save');
        },
        error:(err)=>{
          alert(err.error.detail);
        }
      })
    }
  }
}