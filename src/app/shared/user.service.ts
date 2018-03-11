import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from './user-model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import * as firebase from 'firebase';
import 'rxjs/add/observable/fromPromise';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import UserInfo = firebase.UserInfo;

@Injectable()
export class UserService {
  isLoggedIn$ = new ReplaySubject<boolean>(1);

  private _user$ = new ReplaySubject<UserModel>(1);
  private _fbAuthData: any;
  public currentUserId: string;

  constructor(private _router: Router,
              private _afAuth: AngularFireAuth,
              private _afDb: AngularFireDatabase) {
    this._afAuth.authState.subscribe(
      user => {
        if (user != null) {
          this.currentUserId = user.uid;
          this.getUserById(user.uid).subscribe(remoteUser => {
            console.log(remoteUser);
            this._user$.next(remoteUser);
            this.isLoggedIn$.next(true);
          });
        } else {
          this._user$.next(null);
          this.currentUserId = null;
          this.isLoggedIn$.next(false);
        }
      }
    );
  }

  login(email: string, password: string): Observable<UserModel> {
    return Observable.fromPromise(this._afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  register(param: UserModel, password: string) {
    return Observable.fromPromise(
      this._afAuth.auth.createUserWithEmailAndPassword(param.email, password)
    )
      .do(
        (user: UserInfo) => {
          this.save({...param, id: user.uid});
        }
      );
  }

  save(param: UserModel) {
    return Observable.fromPromise(this._afDb.object(`users/${param.id}`).set(param));
  }

  getUserById(fbId: string): Observable<UserModel> {
    return this._afDb.object(`users/${fbId}`);
  }

  getCurrentUser() {
    return this._user$.asObservable();
  }

  logout() {
    this._afAuth.auth.signOut();
  }

  modify(param: UserModel) {
    return this._afDb.object(`users/${param.id}`).set(param)
      .then(
        user => user
      );
  }

  changeEmail(email) {
    return Observable.fromPromise(this._afAuth.auth.currentUser.updateEmail(email));
    // return Observable.fromPromise(firebase.auth().currentUser.updateEmail(email));
  }

  reAuth(password) {
    const user = this._afAuth.auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );
    console.log(credential);
    return Observable.fromPromise(this._afAuth.auth.currentUser.reauthenticateWithCredential(credential));
  }

}
