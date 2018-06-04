import {
  ChangeDetectorRef, Component, EventEmitter, OnInit,
  Output
} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {CategoryService} from '../../shared/category.service';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {OpenChatListService} from "../../shared/open-chat-list.service";
import {Observable} from "rxjs/Observable";

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
  public isCollapsed = true;
  public newMessagesLength$: Observable<number>;

  constructor(public userService: UserService,
              private _categoryService: CategoryService,
              private _modalService: BsModalService,
              private _changeDetection: ChangeDetectorRef,
              private _openChatListService: OpenChatListService) {
  }

  ngOnInit() {
    this.itemCategories = this._categoryService.getItemCategories();
    this.eventCategories = this._categoryService.getEventCategories();
    this.newMessagesLength$ = this._openChatListService.getNewMessagesLength();
  }

  logout(event) {
    event.preventDefault();
    this.userService.logout();
    this.isCollapsed = true;
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
    this.isCollapsed = true;
  }

  showChatList(event) {
    event.preventDefault();
    event.stopPropagation();
    this._openChatListService.setOpenChatList(true);
    this.isCollapsed = true;
  }

  unsubscribe() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this._subscriptions = [];
  }
}
