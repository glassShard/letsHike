import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from './user-model';
import {Observable} from 'rxjs/Observable';
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
            console.log(remoteUser);
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
      .do(user => console.log(user))
      .switchMap(user => {
        return this._http.put<UserModel>(`${environment.firebase.baseUrl}/users/${user.id}.json`, user);
      });
  }

  modify(user: UserModel) {
    return this._http.put<UserModel>(`${environment.firebase.baseUrl}/users/${user.id}.json`, user);
  }

  getCurrentUser() {
    return this._user$.asObservable();
  }

  getUserById(fbId: string): Observable<UserModel> {
    return this._http.get<UserModel>(`${environment.firebase.baseUrl}/users/${fbId}.json`);
    // return new Observable(
    //   observer => {
    //     const dbUser = firebase.database().ref(`users/${fbId}`);
    //     dbUser.once('value').then(snapshot => {
    //       observer.next(snapshot.val());
    //     });
    //   }
    // );
  }

  logout() {
    firebase.auth().signOut();
  }

  changeEmail(email) {
    return Observable.fromPromise(firebase.auth().currentUser.updateEmail(email));
  }

  reAuth(password) {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );
    return Observable.fromPromise(firebase.auth().currentUser.reauthenticateWithCredential(credential));
  }

}
