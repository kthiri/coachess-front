import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../admin/services/auth.service';


@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

  constructor(private authenticationService: AuthService, private router: Router,) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      {
        var roles=this.authenticationService.getUserFromLocalCache().roles;
        if(roles.includes("ROLE_ADMIN"))
        {
          return true;
        }
      }
      
    }
    this.router.navigate(['/sign-in']);
    // this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`);
    return false;
  }

}
