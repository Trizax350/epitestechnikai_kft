import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-editinventorydialog',
  templateUrl: './checkpricelogdialog.component.html'
})
export class CheckPriceLogDialogComponent implements OnInit {
  data: any;
  prices: any=[];
  timestamps: any=[];
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private InventoryService: InventoryService, 
    private dialogRef: MatDialogRef<CheckPriceLogDialogComponent>
  ) { }

  ngOnInit(): void {
    this.getContainerPriceLogByID();
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: "Tartály árváltozások"
    },
    xAxis: {
      title: {
        text: "Időpontok"
      }
    },
    yAxis: {
      title: {
        text: "Árak (€)"
      }
    },
    series: [
      {
        name: "Tartály ára",
        type: "spline",
        data: [{
          //A chart szerint üresek a tömbök...
          x: this.timestamps.length,
          y: this.prices.length,
        }],
        dataLabels: {
          enabled: true,
          overflow: 'justify'
        }
      },
    ],
    credits: {
      enabled: false,
    }
  };

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