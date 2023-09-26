import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'user';

  
  
  getCustomers(): Observable<any[]>
 { 
  const api=this.apiUrl+'/all/customer'
   return this.httpClient.get<any[]>(api);
 }
 getAdmins(): Observable<any[]>
 { 
  const api=this.apiUrl+'/all/admin'
   return this.httpClient.get<any[]>(api);
 }

  addCustomer(item: any): Observable<any[]> {
    const api=this.apiUrl+'/customer'
    return this.httpClient.post<any[]>(api, item);    
  }
  addAdmin(item: any): Observable<any[]> {
    const api=this.apiUrl+'/admin'
    return this.httpClient.post<any[]>(api, item);    
  }

  updateUser(item:any): Observable<any> {
   
    return this.httpClient.put<any>(this.apiUrl, item);    
  }
 
  deleteUser(id:any) {
    return this.httpClient.delete<any>(this.apiUrl, id);    
  }

}

