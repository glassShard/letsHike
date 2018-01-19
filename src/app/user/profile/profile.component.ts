import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserModel;

  constructor(private _userService: UserService) {}


  ngOnInit() {
    this._userService.getCurrentUser().subscribe(user => this.user = user);
    console.log(this.user);
  }

}
