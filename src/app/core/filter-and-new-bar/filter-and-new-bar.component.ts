import {
  ChangeDetectorRef,
  Component, EventEmitter, Input, OnInit,
  Output, Renderer2
} from '@angular/core';
import {LoginModalComponent} from '../login-modal/login-modal.component';
import {Subscription} from 'rxjs/Subscription';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {UserModel} from "../../shared/user-model";
import {Router} from "@angular/router";
import {VerifyEmailComponent} from "../../verify-email/verify-email.component";

@Component({
  selector: 'app-filter-and-new-bar',
  templateUrl: './filter-and-new-bar.component.html',
  styleUrls: ['./filter-and-new-bar.component.css']
})
export class FilterAndNewBarComponent implements OnInit {
  @Input() categories: string[];
  @Input() title: string;
  @Input() newButton: string;
  @Output() choosenCategory = new EventEmitter();
  @Output() searchField = new EventEmitter();
  @Input() currentUser: UserModel;
  private categoryButtonLabel = 'Kategóriák';
  public choosenCat = '';
  private _subscriptions: Subscription[] = [];
  public modalRef: BsModalRef;
  isCollapsed = true;


  constructor(private renderer: Renderer2,
              private _modalService: BsModalService,
              private _changeDetection: ChangeDetectorRef,
              private _router: Router) { }

  ngOnInit() {
  }

  onCategoryClick(category) {
    this.choosenCategory.emit({category: category});
    this.choosenCat = category;
  }

  onKeyup($event) {
    this.searchField.emit({text: $event.srcElement.value});
  }

  categoryButtonClick() {
    if (!this.isCollapsed) {
      this.choosenCategory.emit({category: null});
      this.choosenCat = '';
    }
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.categoryButtonLabel = 'Kategóriák';
    } else {
      this.categoryButtonLabel = 'Mind';
    }
  }

  setHeight(el, height) {
    this.renderer.setStyle(el, 'height', height + 'px');
  }

  newButtonClicked(event) {
    event.preventDefault();
    if (this.currentUser) {
      if (!this.currentUser.emailVerified) {
        this.showVerifyEmailModal();
      } else {
        this._router.navigate(['/turak/new']);
      }
    } else {
      this.showLoginModal();
    }
  }

  showVerifyEmailModal() {
    this.modalRef = this._modalService.show(VerifyEmailComponent);
  }

  showLoginModal() {
    this._subscriptions.push(this._modalService.onHide
      .subscribe(() => {
        this._changeDetection.markForCheck();
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
      }));
    const initialState = {
      modalTitle: 'Előbb lépj be!',
      text: 'Új hirdetést csak belépés után adhatsz fel.',
      needRememberMe: true,
      needEmail: true,
      closeBtnName: 'Belépés',
      isReAuth: false
    };
    this.modalRef = this._modalService.show(LoginModalComponent);
    Object.assign(this.modalRef.content, initialState);
  }
}
