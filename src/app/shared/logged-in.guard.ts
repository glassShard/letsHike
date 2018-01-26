import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from './user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private _userService: UserService,
              private _router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._userService.isLoggedIn$.map(
      isLoggedIn => {
        if (isLoggedIn === false) {
          this._router.navigate(['/kezdolap']);
          return false;
        }
        return true;
      }
    );



    // if (this._userService.isLoggedIn$) {
    //   return true;
    // } else {
    //   this._router.navigate(['/kezdolap']);
    // }
  }
}
