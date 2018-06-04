import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef
} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../../environments/environment';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import 'rxjs/add/operator/share';
import {VerifyEmailComponent} from '../../verify-email/verify-email.component';
import {SEOServiceService} from '../../shared/seoservice.service';
import {WindowRef} from '../../shared/windowRef';
import {CategoryService} from '../../shared/category.service';
import 'rxjs/add/operator/switchMap';
import {LoginModalComponent} from '../../core/login-modal/login-modal.component';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit, OnDestroy {

  public event$: Observable<EventModel>;
  public currentUser: UserModel;
  public isGuest = false;
  public joinSuccessAlert = false;
  public dangerAlert = false;
  public deleteJoinSuccessAlert = false;
  buttonDisabled = false;
  public root = environment.links.root;
  public swiperIndex = 0;
  public showImageSwiper: boolean;
  public showChat = false;
  public modalRef: BsModalRef;
  public recipientsId: string[] = [];
  public emailModalTitle: string;
  public creatorId: string;
  public guestsIds: string[];
  public smallPic: string;
  private _subscriptions: Subscription[] = [];

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _userService: UserService,
              private _modalService: BsModalService,
              private _seoService: SEOServiceService,
              private _windowRef: WindowRef,
              private _categoryService: CategoryService,
              private _changeDetection: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._subscriptions.push(this._userService.isLoggedIn$
      .flatMap(isLoggedIn => {
        if (isLoggedIn) {
          return this._userService.getCurrentUser();
        } else {
          return Observable.of(null);
        }
      }).subscribe(user => this.currentUser = user)
    );

    const evId = this._route.snapshot.params['id'];
    if (evId) {
      this.loadEvent(evId);
    } else {
      this.event$ = Observable.of(new EventModel());
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  onJoin(userId: string, eventId: string) {

    if (this.currentUser.emailVerified) {
      this.buttonDisabled = true;
      this.joinSuccessAlert = false;
      this.dangerAlert = false;
      this._subscriptions.push(this._eventService.join(userId, eventId).subscribe(() => {
        this.joinSuccessAlert = true;
      }, () => {
        this.dangerAlert = true;
      }));
    } else {
      this.modalRef = this._modalService.show(VerifyEmailComponent);
    }
  }

  onDeleteJoin(userId: string, eventId: string) {
    this.buttonDisabled = true;
    this.deleteJoinSuccessAlert = false;
    this.dangerAlert = false;
    this._subscriptions.push(this._eventService.deleteJoin(userId, eventId).subscribe(() => {
      this.deleteJoinSuccessAlert = true;
    }, () => {
      this.dangerAlert = true;
    }));
  }

  onDelete(eventId) {
    this._subscriptions.push(this._eventService.delete(eventId)
      .subscribe(
        () => this._router.navigate(['/turak']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      ));
  }

  onEdit(eventId) {
    this._router.navigate(['/turak', eventId]);
  }

  clicked(index) {
    this.swiperIndex = index;
    this.showImageSwiper = true;
  }

  closeChat() {
    this.showChat = false;
  }

  showEmailModalWindow(param: string, template: TemplateRef<any>) {
    if (param === 'creator') {
      this.emailModalTitle = 'Email a hirdetőnek';
      this.recipientsId = [this.creatorId];
    } else {
      this.emailModalTitle = 'Levél a jelentkezőknek';
      this.recipientsId = this.guestsIds;
    }
    this.modalRef = this._modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  private loadEvent(evId: string) {
    const handle404 = () => {
      this._router.navigate(['404']);
    };
    this.event$ = this._eventService.getEventById(evId);
    let categories;
    this._subscriptions.push(this._categoryService.getEventCategories()
      .switchMap(cats => {
        categories = cats;
        return this._eventService.getEventById(evId);
      }).subscribe(ev => {
        const cat = categories.filter(categ => categ.category === ev.category);

        this.smallPic = cat[0].smallPic;
        this.buttonDisabled = false;
        if (ev === null) {
          handle404();
        } else {
          const evm = new EventModel(ev);
          if (this.currentUser && ev.guestsIds) {
            this.isGuest = ev.guestsIds.filter(id => id === this.currentUser.id).length > 0;
          }
          if (!ev.guestsIds) {
            this.isGuest = false;
          }
          this.creatorId = ev.creatorId;
          this.guestsIds = ev.guestsIds ? ev.guestsIds : [];
          this._seoService.setTitle(evm.title);
          this._seoService.setMeta(evm);
        }
      }, () => {
        handle404();
      })
    );
  }

  fbShare() {
    const evId = this._route.snapshot.params['id'];
    this._windowRef.nativeWindow.open(`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fturazzunk.hu%2Fturak%2Fview%2F${evId}&amp;src=sdkpreparse`);
  }

  goToCreator(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.currentUser) {
      this._router.navigate([`/tobbiek/${this.creatorId}`]);
    } else {
      this.showLoginModal();
    }
  }

  showLoginModal() {
    this._subscriptions.push(this._modalService.onHide
      .subscribe(() => {
        this._changeDetection.markForCheck();
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
      }));
    const initialState = {
      modalTitle: 'Ehhez be kell lépni!',
      text: 'A felhasználók profilját csak bejelentkezés után tudod megnézni.',
      needRememberMe: true,
      needEmail: true,
      closeBtnName: 'Belépés',
      isReAuth: false
    };
    this.modalRef = this._modalService.show(LoginModalComponent);
    Object.assign(this.modalRef.content, initialState);
  }
}
