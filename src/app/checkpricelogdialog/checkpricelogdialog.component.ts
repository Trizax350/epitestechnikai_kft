import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-editinventorydialog',
  templateUrl: './checkpricelogdialog.component.html',
  styleUrls: ['./checkpricelogdialog.component.scss']
})
export class CheckPriceLogDialogComponent implements OnInit {
  actionBtn: string = "Mentés";
  data: any;
  prices: any=[];
  timestamps: any=[];
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private InventoryService: InventoryService, 
    private dialogRef: MatDialogRef<CheckPriceLogDialogComponent>
  ) { }

  public graph = {
      data: [{ x: this.timestamps, y: this.prices, type: 'line' }],
      layout: {autosize: true, title: 'Tartály árak'},
  };

  ngOnInit(): void {
    this.getContainerPriceLogByID();
  }

  getContainerPriceLogByID(){
    this.InventoryService.getPriceLogByContainerID(this.editData.ID).subscribe({
      next:(data) => {
        this.data = data;
        for(const c of data){
          this.prices.push(c.Price);
          this.timestamps.push(formatDate(c.Date_of_price, 'yyyy/MM/dd H:m:ss', 'en'));
        }
        console.log(this.data);
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
