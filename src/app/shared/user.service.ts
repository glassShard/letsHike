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
import {ReplaySubject} from 'rxjs/ReplaySubject';
import * as firebase from 'firebase';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class UserService {
  isLoggedIn$ = new ReplaySubject<boolean>(1);

  private _user$ = new ReplaySubject<UserModel>(1);
  private _fbAuthData: any;
  public currentUserId: string;

  constructor(private _router: Router,
              private _http: HttpClient) {
    firebase.auth().onAuthStateChanged(
      user => {
        if (user != null) {
          this._fbAuthData = user;
          this.currentUserId = user.uid;
          this.getUserById(user.uid).subscribe(remoteUser => {
            this._user$.next(remoteUser);
          });
          this.isLoggedIn$.next(true);
        } else {
          this._fbAuthData = null;
          this._user$.next(null);
          this.currentUserId = null;
          this.isLoggedIn$.next(false);
        }
      }
    );
  }

  login(email: string, password: string): Observable<UserModel> {
    return Observable.fromPromise(firebase.auth().signInWithEmailAndPassword(
      email, password
    ));
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
      .do(user => console.log('sikeres login ezzel a userrel: ', user));
  }

  getCurrentUser() {
    return this._user$.asObservable();
  }

  getUserById(fbId: string) {
    return this._http.get<UserModel>(`${environment.firebase.baseUrl}/users/${fbId}.json`);
  }

  logout() {
    firebase.auth().signOut();

    // this._user = new UserModel();
    // this.currentUserId = this._user.id;
    // delete(this._fbAuthData);
    this._router.navigate(['/kezdolap']);
    console.log('kileptunk');
  }

}
