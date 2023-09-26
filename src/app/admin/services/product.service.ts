import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Product } from '../classes/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.apiUrl;
  private apiUrl=this.url+'api/produits';
  private coursUrl=this.url+'api/cours';
  private commentaireUrl=this.url+'api/commentaire';

  
  addCommentaire(item:any):Observable<any> {
    const api=this.commentaireUrl+'/add';
    return this.httpClient.post<any>(this.url,item);
  }

  getCommentarires(id:any) :Observable<any> {
    const api=this.commentaireUrl+'/all';

    const params = new HttpParams().set('filter-cours', id);

    return this.httpClient.get<any>(this.url,{ params });
  }

  getReviews(id:any):Observable<any[]>
  {
    const api=`${this.apiUrl}/reviews/${id}`;
    return this.httpClient.get<any[]>(api);
  }
  addReview(review:any):Observable<any[]>
  {
    const api=this.apiUrl+'/add-review'
    return this.httpClient.post<any[]>(api, review);  
  }

  filterByColors(colors:any):Observable<any>
  {
    const api=this.apiUrl+'/filter-color';
    return this.httpClient.post<any[]>(api,colors);
  }
  
  filterByCategory(name:string)
  {
    const api = `${this.apiUrl}/filter-category?name=${name}`;
    return this.httpClient.get<any[]>(api);
  }
  filterByBrand(name:string)
  {
    const api=this.apiUrl+'/filter-brand';
    return this.httpClient.post<any[]>(api,name);
  }
  filterByName(name:string)
  {
    const api = `${this.apiUrl}/filter-name?name=${name}`;
    return this.httpClient.get<any[]>(api);
  }

  filterByColor(color:string)
  {
    const api = `${this.apiUrl}/filter-color?color=${color}`;
    return this.httpClient.get<any[]>(api);
  }
  sortByName(name: string, dir: string) {
    const api = `${this.apiUrl}/all/sort?sortName=${name}&sortDir=${dir}`;
    return this.httpClient.get<any[]>(api);
  }
  sortByPrice(name: string, dir: string) {
    const api = `${this.apiUrl}/all/sort?sortName=${name}&sortDir=${dir}`;
    return this.httpClient.get<any[]>(api);
  }

  getProducts(): Observable<Product[]>
 {  
  const api=this.apiUrl+'/all'
   return this.httpClient.get<Product[]>(api);
 }

 findProductById(id:any):Observable<any>
 {
  const api=this.apiUrl+'/find/'+id
   return this.httpClient.get<any>(api);
 }

 findCoursById(id:any):Observable<any>
 {
  const api=this.coursUrl+'/find/'+id
   return this.httpClient.get<any>(api);
 }

 getCourses(): Observable<any[]>
 {  
  const api=this.coursUrl+'/all'
   return this.httpClient.get<any[]>(api);
 }

 getById(id:any):Observable<any>
 {
  const api=`${this.apiUrl}/find/${id}`;
  return this.httpClient.get<any>(api);
 }

 
  //Create a New Proudct
 addProduct(item: any): Observable<any[]> {
  const api=this.apiUrl+'/add'
    return this.httpClient.post<any[]>(api, item);    
  }

  addCours(item: any): Observable<any[]> {
    const api=this.coursUrl+'/add'
      return this.httpClient.post<any[]>(api, item);    
    }

   //Update Proudct
  updateProduct(id:any,item:any): Observable<any> {
    const api=`${this.apiUrl}/update/${id}`;
    return this.httpClient.put<any>(api, item);    
  }
  updateCours(item:any): Observable<any> {
    const api=`${this.coursUrl}/update`;
    return this.httpClient.put<any>(api, item);    
  }
  //Delete Proudct
  deleteProduct(id:any) {
    const api=`${this.apiUrl}/delete/${id}`;
    return this.httpClient.delete<any>(api);    
  }

  deleteCours(id:any) {
    const api=`${this.coursUrl}/delete/${id}`;
    return this.httpClient.delete<any>(api);    
  }

}

