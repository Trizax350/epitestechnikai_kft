import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { order } from '../order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getOrder(): Observable<Array<order>> {
    let url = this.baseUrl + '/order_list_all';
    return this.http.get<any>(url);
  }

  postOrder(data: any){
    let url = this.baseUrl + '/order_post';
    return this.http.post<any>(url, data);
  }

  putOrder(data: any, id: number){
    let url = this.baseUrl + '/order_update_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getOrderItemByID(id: number): Observable<Array<order>> {
    let url = this.baseUrl + '/order_get_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteOrderItem(id: number){
    let url = this.baseUrl + '/order_delete_by_id/'+id;
    return this.http.delete<any>(url);
  }
}