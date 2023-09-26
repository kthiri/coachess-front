import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'order';

  
  
  getOrders(): Observable<any[]>
 {  
  const api=this.apiUrl+'/all'
   return this.httpClient.get<any[]>(api);
 }

  addOrder(item: any): Observable<any[]> {
    const api=this.apiUrl+'/add'
    return this.httpClient.post<any[]>(api, item);    
  }

  updateOrder(id:any,item:any): Observable<any> {
    const api=`${this.apiUrl}/update/${id}`;
    return this.httpClient.put<any>(api,item);    
  }
 
  deleteOrder(id:any) {
    const api=`${this.apiUrl}/update/${id}`;
    return this.httpClient.delete<any>(api);    
  }

}
