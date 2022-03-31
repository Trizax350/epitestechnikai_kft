import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { inventory } from '../inventory/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getInventory(): Observable<Array<inventory>> {
    let url = this.baseUrl + '/inventory_list_all';
    return this.http.get<any>(url);
  }

  getStock(): Observable<Array<inventory>> {
    let url = this.baseUrl + '/stock_list_all';
    return this.http.get<any>(url);
  }

  postInventory(data: any){
    let url = this.baseUrl + '/inventory_post';
    return this.http.post<any>(url, data);
  }

  putInventory(data: any, id: number){
    let url = this.baseUrl + '/inventory_update_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getInventoryItemByID(id: number): Observable<Array<inventory>> {
    let url = this.baseUrl + '/inventory_get_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteInventoryItem(id: number){
    let url = this.baseUrl + '/inventory_delete_by_id/'+id;
    return this.http.delete<any>(url);
  }
}