import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './shared/user.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {SEOServiceService} from './shared/seoservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn$: ReplaySubject<boolean>;

  constructor(private _userService: UserService,
              private _seoService: SEOServiceService) {

    this.isLoggedIn$ = this._userService.isLoggedIn$;
    this._seoService.addSeoData();
  }
}


