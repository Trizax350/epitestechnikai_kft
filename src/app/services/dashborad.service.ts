import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getOrdAndRevSumAllContainers(): Observable<Array<any>> {
    let url = this.baseUrl + '/dashboard_list_ord_rev_all';
    return this.http.get<any>(url);
  }

  getOrdAndRevSumByContainers(): Observable<Array<any>> {
    let url = this.baseUrl + '/dashboard_list_ord_rev_stat';
    return this.http.get<any>(url);
  }

  getNextDelivery(): Observable<any> {
    let url = this.baseUrl + '/next_delivery_datas';
    return this.http.get<any>(url);
  }

  getNextOrder(): Observable<any> {
    let url = this.baseUrl + '/next_order_datas';
    return this.http.get<any>(url);
  }

  getCustomersByCount(): Observable<any> {
    let url = this.baseUrl + '/dashboard_customer_list';
    return this.http.get<any>(url);
  }
}