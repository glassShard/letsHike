import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from './user-model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import { merge } from 'rxjs/observable/merge';
import * as firebase from 'firebase';
import 'rxjs/add/observable/fromPromise';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import UserInfo = firebase.UserInfo;

@Injectable()
export class UserService {
  isLoggedIn$ = new ReplaySubject<boolean>(1);
  public currentUserId: string;
  public currentUserId$ = new ReplaySubject<string>(1);
  private _user$ = new ReplaySubject<UserModel>(1);
  private _fbAuthData: any;

  constructor(private _router: Router,
              private _afAuth: AngularFireAuth,
              private _afDb: AngularFireDatabase) {
    this._afAuth.authState.subscribe(
      user => {
        console.log(user);
        if (user != null) {
          this.currentUserId = user.uid;
          this.currentUserId$.next(user.uid);
          this.getUserById(user.uid).subscribe(remoteUser => {
            Object.assign(remoteUser, {'emailVerified': user.emailVerified});
            console.log(remoteUser);
            this._user$.next(remoteUser);
            this.isLoggedIn$.next(true);
          });
        } else {
          this._user$.next(null);
          this.currentUserId = null;
          this.currentUserId$.next(null);
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

  verifyEmail() {
    return Observable.fromPromise(this._afAuth.auth.currentUser.sendEmailVerification());
  }

  save(param: UserModel) {
    return Observable.fromPromise(this._afDb.object(`users/${param.id}`).set(param));
  }

  saveCategory(where: string, category: string, checked: boolean) {
    if (checked) {
      return merge(
        Observable.fromPromise(
          this._afDb.object(`users/${this.currentUserId}/fav${where}/${category}`).set(true)
        ),
        Observable.fromPromise(
          this._afDb.object(`categories/${where}Categories/${category}/${this.currentUserId}`).set(true)
        )
      );
    } else {
      return merge(
        Observable.fromPromise(
          this._afDb.object(`users/${this.currentUserId}/fav${where}/${category}`).remove()
        ),
        Observable.fromPromise(
          this._afDb.object(`categories/${where}Categories/${category}/${this.currentUserId}`).remove()
        )
      );
    }
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

  changeEmail(newEmail) {
    return Observable.fromPromise(this._afAuth.auth.currentUser.updateEmail(newEmail));
  }

  changePassword(newPassword) {
    return Observable.fromPromise(this._afAuth.auth.currentUser.updatePassword(newPassword));
  }

  sendForgottenPasswordLink(email) {
    return Observable.fromPromise(this._afAuth.auth.sendPasswordResetEmail(email));
  }

  deleteProfile() {
    return this.currentUserId$
      .switchMap(userId => Observable.fromPromise(this._afDb.object(`/users/${userId}`).set(null)))
      .switchMap(res => {
        return this._afAuth.auth.currentUser.delete();
      });
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

  getAllUsers(): Observable<UserModel[]> {
    return this._afDb.list(`users`);
  }
}
