import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { freight } from '../order/freight.model';

@Injectable({
  providedIn: 'root'
})
export class FreightService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getFreight(): Observable<Array<freight>> {
    let url = this.baseUrl + '/freight_list_all';
    return this.http.get<any>(url);
  }

  postFreight(data: any){
    let url = this.baseUrl + '/freight_post';
    return this.http.post<any>(url, data);
  }

  putFreight(data: any, id: number){
    let url = this.baseUrl + '/freight_update_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getFreightItemByID(id: number): Observable<Array<freight>> {
    let url = this.baseUrl + '/freight_get_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteFreightItem(id: number){
    let url = this.baseUrl + '/freight_delete_by_id/'+id;
    return this.http.delete<any>(url);
  }
}