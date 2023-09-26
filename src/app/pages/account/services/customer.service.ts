import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'customer';

  
  
  getOrders(email:any): Observable<any[]>
 { 
  const api=`${this.apiUrl}/orders/${email}`; 
   return this.httpClient.get<any[]>(api);
 }
 

  updateInfo(info: any): Observable<any> {
    const api=this.apiUrl+'/update-info'
    return this.httpClient.post<any>(api, info);    
  }
  updatePassword(info: any): Observable<any> {
    const api=this.apiUrl+'/update-password'
    return this.httpClient.post<any>(api, info);    
  }
 
}