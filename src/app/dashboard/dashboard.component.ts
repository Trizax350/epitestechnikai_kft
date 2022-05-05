import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashborad.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  containers1: Array<any> = [];
  containers2: Array<any> = [];
  customer1: Array<any> = [];
  alldelivery : Array<any> = [];
  delivery1: any;
  order1: any;
  totalval: any;
  totalcount: any;
  constructor(private http: HttpClient, private DashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getOrdAndRevSumByContainers();
    this.getOrdAndRevSumAllContainers();
    this.getAllDelivery();
    this.getCustomersByCount();
    this.getTotalVal();
    this.getTotalCount();
  }

  getOrdAndRevSumByContainers(){
    this.DashboardService.getOrdAndRevSumByContainers().subscribe(data => {
      this.containers1 = data;
    })
  }

  getOrdAndRevSumAllContainers(){
    this.DashboardService.getOrdAndRevSumAllContainers().subscribe(data => {
      this.containers2 = data;
    })
  }

  getTotalVal(){
    this.DashboardService.getTotalVal().subscribe(data => {
      this.totalval = data;
    })
  }

  getTotalCount(){
    this.DashboardService.getTotalCount().subscribe(data => {
      this.totalcount = data;
    })
  }

  getAllDelivery(){
    this.DashboardService.getAllDelivery().subscribe(data => {
      this.alldelivery = data;
    })
  }

  getCustomersByCount(){
    this.DashboardService.getCustomersByCount().subscribe(data => {
      this.customer1 = data;
    })
  }
}
