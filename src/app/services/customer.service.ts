import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { customer } from '../customer/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getCustomer(): Observable<Array<customer>> {
    let url = this.baseUrl + '/customer_list_all';
    return this.http.get<any>(url);
  }

  postCustomer(data: any){
    let url = this.baseUrl + '/customer_post';
    return this.http.post<any>(url, data);
  }

  putCustomer(data: any, id: number){
    let url = this.baseUrl + '/customer_update_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getCustomerItemByID(id: number): Observable<Array<customer>> {
    let url = this.baseUrl + '/customer_get_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteCustomerItem(id: number){
    let url = this.baseUrl + '/customer_delete_by_id/'+id;
    return this.http.delete<any>(url);
  }
}