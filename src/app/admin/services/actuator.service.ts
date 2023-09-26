import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ActuatorService {

  constructor(private httpClient:HttpClient) { }

  private url=environment.authUrl;
  private apiUrl=this.url+'actuator';

  
  
  getHealth(): Observable<any>
 { 
  const api=this.apiUrl+'/health'
   return this.httpClient.get<any>(api);
 }
 getInfo(): Observable<any>
 { 
  const api=this.apiUrl+'/info'
   return this.httpClient.get<any>(api);
 }
}