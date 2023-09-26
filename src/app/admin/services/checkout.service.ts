import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  
  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'api/checkout/purchase';

  placeOrder(item:any):Observable<any[]>
  {
    return this.httpClient.post<any[]>(this.apiUrl, item);  
  }
}