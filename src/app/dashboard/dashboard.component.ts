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
  delivery1: any;
  order1: any;
  constructor(private http: HttpClient, private DashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getOrdAndRevSumByContainers();
    this.getOrdAndRevSumAllContainers();
    this.getNextDelivery();
    this.getNextOrder();
    this.getCustomersByCount();
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

  getNextDelivery(){
    this.DashboardService.getNextDelivery().subscribe(data => {
      this.delivery1 = data;
    })
  }

  getNextOrder(){
    this.DashboardService.getNextOrder().subscribe(data => {
      this.order1 = data;
    })
  }

  getCustomersByCount(){
    this.DashboardService.getCustomersByCount().subscribe(data => {
      this.customer1 = data;
      console.log(this.customer1);
    })
  }
}
