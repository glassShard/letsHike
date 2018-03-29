import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../../environments/environment';

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
  private _subscriptions: Subscription[] = [];
  public showChat = false;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _userService: UserService) {
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
      }
    }, () => {
      handle404();
    }));
  }

  closeChat() {
    this.showChat = false;
  }
}

