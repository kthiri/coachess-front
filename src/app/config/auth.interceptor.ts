import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../admin/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private apiUrl=environment.apiUrl;
  private authUrl=environment.authUrl;

  constructor(private authenticationService: AuthService) {}


  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {

    if (this.shouldExclude(httpRequest.url)) {
      return httpHandler.handle(httpRequest);
    }

    if (this.shouldInclude(httpRequest.url,httpRequest.method)) {
      this.authenticationService.loadToken();
      const token = this.authenticationService.getToken();
      const request = httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
      return httpHandler.handle(request);
    }

    return httpHandler.handle(httpRequest);
  }

  // utility method to check if the URL should be excluded
  private shouldExclude(url: string): boolean {
    const excludedUrls = [
      `${this.apiUrl}product/filter-color`,
      `${this.apiUrl}product/filter-brand`,
      `${this.apiUrl}product/add-review`,
      `${this.apiUrl}/api/checkout/purchase`
    ];

    return excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }

  // utility method to check if the URL should be included and requires authentication
  private shouldInclude(url: string,method: string): boolean {
    const includedUrls = [
      `${this.apiUrl}product/`,
      `${this.apiUrl}category/`,
      `${this.apiUrl}order/`,
      `${this.apiUrl}user/`,
      `${this.authUrl}actuator/`
    ];

    // const includedMethods = ['POST', 'PUT', 'DELETE'];
    const includedMethods = (url.includes(`${this.apiUrl}order/`) || url.includes(`${this.apiUrl}user/`) || url.includes( `${this.authUrl}actuator/`) ) ? ['POST', 'PUT', 'DELETE', 'GET'] : ['POST', 'PUT', 'DELETE'];

    // return includedUrls.some(includedUrl => {
    //   return url.includes(includedUrl) && includedMethods.includes(method);

    return includedUrls.some(includedUrl => {
      return url.includes(includedUrl) && this.requiresAuthentication(includedUrl) && includedMethods.includes(method);
    });
  }

  // utility method to check if the URL requires authentication
  private requiresAuthentication(url: string): boolean {
    const authenticatedUrls = [
      `${this.apiUrl}product/`,
      `${this.apiUrl}category/`,
      `${this.apiUrl}order/`,
      `${this.apiUrl}user/`,
      `${this.authUrl}actuator/`
    ];

    return authenticatedUrls.some(authenticatedUrl => url.includes(authenticatedUrl));
  }
}
