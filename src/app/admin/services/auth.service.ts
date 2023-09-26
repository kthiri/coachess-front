import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private httpClient:HttpClient) { }

  private url=environment.authUrl;
  private apiUrl=this.url+'auth';

  private token!: string;
  private loggedInUsername!: string;
  private jwtHelper = new JwtHelperService();
  private isAuthenticated=false;
  private current!:any;

  
  login(user:any): Observable<any>
 {  
  const api=this.apiUrl+'/signin'
   return this.httpClient.post<any>(api,user);
 }

 register(user:any): Observable<any>
 {  
  const api=this.apiUrl+'/signup'
   return this.httpClient.post<any>(api,user);
 }

 
 registerClient(user:any): Observable<any>
 {  
  const api=this.apiUrl+'/signup-client'
   return this.httpClient.post<any>(api,user);
 }


 
 public logOut(): void {
  this.token = null!;
  this.loggedInUsername = null!;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('users');
}

public saveToken(token: string): void {
  this.token = token;
  localStorage.setItem('token', token);
}

public addUserToLocalCache(user: any): void {
  localStorage.setItem('user', JSON.stringify(user));
}

public getUserFromLocalCache(): any {
  return JSON.parse(localStorage.getItem('user')!);
}

public loadToken(): void {
  this.token = localStorage.getItem('token')!;
}
public getToken(): string {
  return this.token;
}

public isUserLoggedIn(): boolean {
  this.loadToken();
  if (this.token != null && this.token !== ''){
    if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
      if (!this.jwtHelper.isTokenExpired(this.token)) {
        this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
        return true;
      }
    }
  } else {
    this.logOut();
    return false;
  }
}


}

 
