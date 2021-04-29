import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    // CHECK DULU DI LOCAL STORAGE ADA GAK DATA USERNYA
    if (localStorage.getItem('currentUser') == null) {
      return this.router.createUrlTree(
        ['/login'],
        { queryParams: { returnUrl: state.url } }
      );
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = user['accessToken'];
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const isExpired = helper.isTokenExpired(token);

    // console.log(user);
    // console.log(token);
    // console.log(decodedToken);
    // console.log(isExpired);

    // CHECK TOKEN EXPIRED APA NGGK
    if (isExpired) {
      return this.router.createUrlTree(
        ['/login'],
        { queryParams: { returnUrl: state.url } }
      );
    } else {

      const allowedRoles = next.data.allowedRoles;
      // console.log(allowedRoles);
      // console.log(decodedToken.role);

      for (let index = 0; index < allowedRoles.length; index++) {
        const element = allowedRoles[index];
        // console.log(element);

        for (let index = 0; index < decodedToken.role.length; index++) {
          const element2 = decodedToken.role[index];
          if (element === element2) return true;
        }

      }

      return this.router.createUrlTree(
        ['404']
      );

    }




  }

}
