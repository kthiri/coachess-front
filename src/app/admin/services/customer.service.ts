import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'customer';

  
  
  getCustomer(): Observable<User[]>
 {  
   return this.httpClient.get<User[]>(this.apiUrl);
 }

 addCustomer(item: any): Observable<any[]> {
    return this.httpClient.post<any[]>(this.apiUrl, item);    
  }

  updateCustomer(item:any): Observable<any> {
   
    return this.httpClient.put<any>(this.apiUrl, item);    
  }
 
  deleteCustomer(id:any) {
    return this.httpClient.delete<any>(this.apiUrl, id);    
  }

}
