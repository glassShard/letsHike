import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public user: UserModel;

  constructor(private _userService: UserService,
              private _router: Router) { }

  ngOnInit() {
    this.user = UserModel.emptyUser;
  }

  register(form) {

    console.log(form);
    // this._userService.register(this.user, password)
    //   .subscribe(data => this._router.navigate(['/user']), err => console.warn(err));
  }
}
