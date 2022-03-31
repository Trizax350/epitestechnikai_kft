import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { delivery } from '../delivery/delivery.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getDelivery(): Observable<Array<delivery>> {
    let url = this.baseUrl + '/delivery_list_all';
    return this.http.get<any>(url);
  }

  postDelivery(data: any){
    let url = this.baseUrl + '/delivery_post';
    return this.http.post<any>(url, data);
  }

  putDelivery(data: any, id: number){
    let url = this.baseUrl + '/delivery_update_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getDeliveryItemByID(id: number): Observable<Array<delivery>> {
    let url = this.baseUrl + '/delivery_get_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteDeliveryItem(id: number){
    let url = this.baseUrl + '/delivery_delete_by_id/'+id;
    return this.http.delete<any>(url);
  }
}