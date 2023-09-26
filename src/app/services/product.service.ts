import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'api/produits';

  

  getProducts(): Observable<any[]>
 {  
  const api=this.apiUrl+'/all'
   return this.httpClient.get<any[]>(api);
 }

 
  //Create a New Proudct
 addProduct(item: any): Observable<any[]> {
  const api=this.apiUrl+'/add'
    return this.httpClient.post<any[]>(api, item);    
  }

   //Update Proudct
  updateProduct(id:any,item:any): Observable<any> {
    const api=`${this.apiUrl}/update/${id}`;
    return this.httpClient.put<any>(api, item);    
  }
  //Delete Proudct
  deleteProduct(id:any) {
    const api=`${this.apiUrl}/${id}`;
    return this.httpClient.delete<any>(api);    
  }

}

