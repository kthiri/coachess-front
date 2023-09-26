import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Order } from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'commande';

  
  
  getOrders(): Observable<Order[]>
 {  
  const api=this.apiUrl+'/all'
   return this.httpClient.get<Order[]>(api);
 }

  addOrder(item: any): Observable<any[]> {
    const api=this.apiUrl+'/add'
    return this.httpClient.post<any[]>(api, item);    
  }

  updateOrderStatus(id:any,satus:any): Observable<any> {
    const api=`${this.apiUrl}/update-status/${id}/${satus}`;
    return this.httpClient.post<any>(api,satus);    
  }
 
  deleteOrder(id:any) {
    const api=`${this.apiUrl}/delete/${id}`;
    return this.httpClient.delete<any>(api);    
  }

}
