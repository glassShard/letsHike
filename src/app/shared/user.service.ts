import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from './user-model';

@Injectable()
export class UserService {
  isLoggedIn = false;

  private _user: UserModel;
  private _allUsers: UserModel[];

  constructor(private _router: Router) {
    this._allUsers = [
      new UserModel({
        id: 1,
        email: 'a@b.hu',
        nick: 'valaki',
        dateOfBirth: '2000-05-12',
        tel: '+3629456321'
      }),
      new UserModel({
        id: 2,
        email: 'c@b.hu',
        nick: 'másvalaki',
        dateOfBirth: '2000-07-12',
        tel: '+3629456321'
      }),
      new UserModel({
        id: 3,
        email: 'b@c.hu',
        nick: 'mégvalaki',
        dateOfBirth: '1995-05-12',
        tel: '+3629456321'
      }),
      new UserModel({
        id: 4,
        email: 'd@b.hu',
        nick: 'Yoda mester',
        dateOfBirth: '2002-05-12',
        tel: '+3629459871'
      }),
      new UserModel({
        id: 5,
        email: 'u@b.hu',
        nick: 'Anakin',
        dateOfBirth: '3845-05-12',
        tel: '+3621236321'
      })
    ];
    console.log('kezdeti bejelentkezés: ', this.isLoggedIn);
  }

  login(email: string, password: string): boolean {
    if (email === 'angular' && password === 'angular') {
      this._user = new UserModel(UserModel.exampleUser);
      this.isLoggedIn = true;
      console.log('be vagyunk-e lépve: ', this.isLoggedIn);
      this._router.navigate(['/user']);
    }
    return false;
  }

  logout() {
    this._user = new UserModel();
    this.isLoggedIn = false;
    console.log('be vagyunk-e lépve: ', this.isLoggedIn);
    this._router.navigate(['/kezdolap']);
  }

  register(param?: UserModel) {
    if (param) {
      this._user = new UserModel(param);
    } else {
      this._user = new UserModel(UserModel.exampleUser);
    }
    this.isLoggedIn = true;
    this._router.navigate(['/user']);
  }

  getUserById(id: number) {
    const user = this._allUsers.filter(us => us.id === id);
    return user.length > 0 ? user[0] : new UserModel(UserModel.emptyUser);
  }

  getCurrentUser() {
    return this._user;
  }
}
