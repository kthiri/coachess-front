import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Category } from '../classes/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'category';

  
  
  getCategories(): Observable<Category[]>
 {  
  const api=this.apiUrl+'/all'
   return this.httpClient.get<Category[]>(api);
 }

 addCategory(item:any): Observable<any[]> {
  const api=this.apiUrl+'/add'
    return this.httpClient.post<any[]>(api, item);    
  }

  updateCategory(id: any,item:any): Observable<any> {
    const api=`${this.apiUrl}/update/${id}`;
    return this.httpClient.put<any>(api, item);    
  }
 
  deleteCategory(id:any) {
    const api=`${this.apiUrl}/delete/${id}`;
    return this.httpClient.delete<any>(api);    
  }

}
