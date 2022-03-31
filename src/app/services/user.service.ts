import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../app.module';
import { user } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string;

  constructor(private http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) { 
    this.baseUrl = baseUrl ? baseUrl : '';
  }

  getUser(): Observable<Array<user>> {
    let url = this.baseUrl + '/user_list_all';
    return this.http.get<any>(url);
  }

  postUser(data: any){
    let url = this.baseUrl + '/user_post';
    return this.http.post<any>(url, data);
  }

  putUser(data: any, id: number){
    let url = this.baseUrl + '/user_update_by_id/'+id;
    return this.http.put<any>(url, data);
  }

  getUserItemByID(id: number): Observable<Array<user>> {
    let url = this.baseUrl + '/user_get_by_id/'+id;
    return this.http.get<any>(url);
  }

  deleteUserItem(id: number){
    let url = this.baseUrl + '/user_delete_by_id/'+id;
    return this.http.delete<any>(url);
  }
}