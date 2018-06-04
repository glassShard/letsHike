import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CategoryService} from '../../shared/category.service';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {Router} from '@angular/router';
import {LoginModalComponent} from '../../core/login-modal/login-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit, OnDestroy {
  public stringFromSearch$ = new BehaviorSubject(null);
  public users$: Observable<UserModel[]>;
  public eventCategories;
  public currentUserId: string;
  public modalRef: BsModalRef;
  private _subscriptions: Subscription[] = [];
  private _loginModalSubscriptions: Subscription[] = [];

  constructor(private _categoryService: CategoryService,
              private _userService: UserService,
              private _router: Router,
              private _modalService: BsModalService,
              private _changeDetection: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._subscriptions.push(this._userService.currentUserId$
      .subscribe(currentUserId => this.currentUserId = currentUserId));

    this._categoryService.getEventCategories().subscribe(res => this.eventCategories = res);

    this.users$ = this._userService.getAllUsers()
      .flatMap((users: UserModel[]) => {
        return Observable.of(
          users.sort((a, b) => a.nick.localeCompare(b.nick))
        );
      })
      .switchMap(users => {
        return this.stringFromSearch$
          .map(filteredText => {
            if (filteredText === null) {
              return users;
            } else {
              return users.filter(user => {
                return (user.nick.toLowerCase().indexOf(filteredText.toLowerCase()) > -1);
              });
            }
          });
      });
  }

  ngOnDestroy() {
    this.unsubscribe(this._subscriptions);
  }

  profileClicked(userId) {
    if (this.currentUserId) {
      if (this.currentUserId === userId) {
        this._router.navigate(['user']);
      } else {
        this._router.navigate(['/tobbiek', userId]);
      }
    } else {
      this.showLoginModal();
    }
  }

  assignText(text) {
    this.stringFromSearch$.next(text);
  }

  showLoginModal() {
    this._loginModalSubscriptions.push(this._modalService.onHide
      .subscribe(() => this._changeDetection.markForCheck()));
    this._loginModalSubscriptions.push(this._modalService.onHide
      .subscribe(() => this.unsubscribe(this._loginModalSubscriptions)));
    const initialState = {
      modalTitle: 'Belépés',
      text: 'A felhasználók profilját csak belépés után nézheted meg',
      needRememberMe: false,
      needEmail: true,
      closeBtnName: 'Mehet',
      isReAuth: false
    };
    this.modalRef = this._modalService.show(LoginModalComponent);
    Object.assign(this.modalRef.content, initialState);
  }

  unsubscribe(subscriptions: Subscription[]) {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

