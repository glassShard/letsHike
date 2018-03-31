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
  public showEmailModal = false;
  public recipientsEmail: string[] = [];
  public emailModalTitle: string;
  public creatorEmail: string;
  public guestsEmail: string[];
  private _subscriptions: Subscription[] = [];

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _userService: UserService,
              private _modalService: BsModalService,
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
    this.buttonDisabled = true;
    this.joinSuccessAlert = false;
    this.dangerAlert = false;
    this._subscriptions.push(this._eventService.join(userId, eventId).subscribe(() => {
      this.joinSuccessAlert = true;
      console.log(this.joinSuccessAlert);
    }, () => {
      this.dangerAlert = true;
    }));
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
      this.recipientsEmail = [this.creatorEmail];
    } else {
      this.emailModalTitle = 'Levél a jelentkezőknek';
      this.recipientsEmail = this.guestsEmail;
    }
    this.modalRef = this._modalService.show(template);
  }

  // showEmailModal(event) {
  //   event.preventDefault();
  //   // this._subscriptions.push(this._modalService.onHide
  //   //   .subscribe(() => this._changeDetection.markForCheck()));
  //   // this._subscriptions.push(this._modalService.onHide.subscribe(() => {
  //   //   this.unsubscribe();
  //   // }));
  //   const currentEmail = this.currentUser ? this.currentUser.email : '';
  //   console.log(currentEmail);
  //   const initialState = {
  //     emailModalTitle: 'Email a hirdetőnek',
  //     'currentEmail': currentEmail
  //   };
  //
  //   Object.assign(this.modalRef.content, initialState);
  // }

  closeModal() {
    this.modalRef.hide();
  }

  private loadEvent(evId: string) {
    const handle404 = () => {
      this._router.navigate(['404']);
    };
    this.event$ = this._eventService.getEventById(evId);
    this._subscriptions.push(this.event$.subscribe(ev => {
      this.buttonDisabled = false;
      if (ev === null) {
        handle404();
      } else {
        if (this.currentUser && ev.guestsIds) {
          this.isGuest = ev.guestsIds.filter(id => id === this.currentUser.id).length > 0;
        }
        if (!ev.guestsIds) {
          this.isGuest = false;
        }
        this.creatorEmail = ev.creator.email;
        this.guestsEmail = ev.guests ? ev.guests.map(guest => guest.email) : [];
      }
    }, () => {
      handle404();
    }));
  }
}
