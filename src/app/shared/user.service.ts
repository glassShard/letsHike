import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from './user-model';
import {Observable} from 'rxjs/Observable';
import {FirebaseLoginModel} from './firebase-login-model';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {FirebaseRegistrationModel} from './firebase-registration-model';
import 'rxjs/add/observable/of';

@Injectable()
export class UserService {
  isLoggedIn = false;

  private _user: UserModel;
  private _allUsers: UserModel[];
  private _fbAuthData: FirebaseLoginModel | FirebaseRegistrationModel | undefined;
  public currentUserId: string;

  constructor(private _router: Router,
              private _http: HttpClient) {
    this._allUsers = [
      new UserModel({
        id: '',
        email: 'a@b.hu',
        nick: 'valaki',
        dateOfBirth: '2000-05-12',
        tel: '+3629456321'
      }),
      new UserModel({
        id: '',
        email: 'c@b.hu',
        nick: 'másvalaki',
        dateOfBirth: '2000-07-12',
        tel: '+3629456321'
      }),
      new UserModel({
        id: '',
        email: 'b@c.hu',
        nick: 'mégvalaki',
        dateOfBirth: '1995-05-12',
        tel: '+3629456321'
      }),
      new UserModel({
        id: '',
        email: 'd@b.hu',
        nick: 'Yoda mester',
        dateOfBirth: '2002-05-12',
        tel: '+3629459871'
      }),
      new UserModel({
        id: '',
        email: 'u@b.hu',
        nick: 'Anakin',
        dateOfBirth: '3845-05-12',
        tel: '+3621236321'
      })
    ];
    console.log('kezdeti bejelentkezés: ', this.isLoggedIn);
  }

  login(email: string, password: string): Observable<UserModel> {
    return this._http.post<FirebaseLoginModel>(
      `${environment.firebase.loginUrl}?key=${environment.firebase.apiKey}`,
      {
        'email': email,
        'password': password,
        'returnSecureToken': true
      })
      .do((fbAuthResponse: FirebaseLoginModel) => this._fbAuthData = fbAuthResponse)
      .switchMap(fbLogin => this.getUserById(fbLogin.localId))
      .do(user => this.isLoggedIn = true)
      .do(user => this._user = user)
      .do(user => this.currentUserId = user.id)
      .do(user => console.log('sikeres login ezzel a userrel: ', user));
  }

  register(param: UserModel, password: string) {
    return this._http.post<FirebaseRegistrationModel>(
      `${environment.firebase.registrationUrl}?key=${environment.firebase.apiKey}`,
      {
        'email': param.email,
        'password': password,
        'returnSecureToken': true
      })
      .do((fbAuthResponse: FirebaseRegistrationModel) => this._fbAuthData = fbAuthResponse)
      .map(fbRegData => {
        return {
          id: fbRegData.localId,
          ...param
        };
      })
      .switchMap(user => {
        return this._http.put<UserModel>(`${environment.firebase.baseUrl}/users/${user.id}/json`, user);
      })
      .do(user => this.isLoggedIn = true)
      .do(user => this._user = user)
      .do(user => console.log('sikeres login ezzel a userrel: ', user));
  }

  getCurrentUser() {
    return Observable.of(this._user);
  }

  getUserById(fbId: string) {
    return this._http.get<UserModel>(`${environment.firebase.baseUrl}/users/${fbId}.json`);
  }

  logout() {
    this._user = new UserModel();
    this.isLoggedIn = false;
    delete(this._fbAuthData);
    this._router.navigate(['/kezdolap']);
    console.log('kileptunk');
  }
}
