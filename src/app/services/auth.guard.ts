import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree>
     | Promise <boolean | UrlTree> | boolean | UrlTree {
      var isAuthenticated = this.getToken();
      console.log("isAuthenticated",isAuthenticated);
      if (!isAuthenticated) {
      this.router.navigate(["/login"]);
      }
      // else{
      //   if (isAuthenticated.ro)
      // }
    return isAuthenticated;
  }
  getToken() {
    return !!sessionStorage.getItem("token");
  }
  
}
