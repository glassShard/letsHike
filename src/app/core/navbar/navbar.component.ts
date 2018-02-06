import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {CategoryService} from '../../shared/category.service';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public itemCategories;
  public eventCategories;
  private _subscriptions: Subscription[] = [];
  public modalRef: BsModalRef;

  constructor(public userService: UserService,
              private _categoryService: CategoryService,
              private _modalService: BsModalService,
              private _changeDetection: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.itemCategories = this._categoryService.getItemCategories();
    this.eventCategories = this._categoryService.getEventCategories();
  }

  logout(event) {
    event.preventDefault();
    this.userService.logout();
  }

  showLoginModal(event) {
    event.preventDefault();
    this._subscriptions.push(this._modalService.onHide
      .subscribe(() => this._changeDetection.markForCheck()));
    this._subscriptions.push(this._modalService.onHide.subscribe(() => {
      this.unsubscribe();
    }));
    const initialState = {
      modalTitle: 'Belépés',
      text: null,
      needRememberMe: true,
      needEmail: true,
      closeBtnName: 'Belépés',
      isReAuth: false
    };
    this.modalRef = this._modalService.show(LoginModalComponent);
    Object.assign(this.modalRef.content, initialState);
  }

  unsubscribe() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this._subscriptions = [];
  }
}
