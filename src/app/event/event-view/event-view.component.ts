import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import 'rxjs/add/operator/concat';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
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
  private eventWatcherSubscription: Subscription;
  public swiperIndex = 0;
  public showImageSwiper: boolean;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _userService: UserService) {
    _userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this._userService.getCurrentUser()
          .subscribe(user => this.currentUser = user);
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnInit() {
    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this.loadEvent(itId);
    } else {
      this.event$ = Observable.of(new EventModel());
    }
  }

  ngOnDestroy(): void {
    this.eventWatcherSubscription.unsubscribe();
  }

  onJoin(userId: string, eventId: string) {
    this.buttonDisabled = true;
    this.joinSuccessAlert = false;
    this.dangerAlert = false;
    this._eventService.join(userId, eventId).subscribe(() => {
      this.joinSuccessAlert = true;
      console.log(this.joinSuccessAlert);
      //     this.loadEvent(eventId);
    }, () => {
      this.dangerAlert = true;
    });
  }

  onDeleteJoin(userId: string, eventId: string) {
    this.buttonDisabled = true;
    this.deleteJoinSuccessAlert = false;
    this.dangerAlert = false;
    this._eventService.deleteJoin(userId, eventId).subscribe(() => {
      this.deleteJoinSuccessAlert = true;
//      this.loadEvent(eventId);
    }, () => {
      this.dangerAlert = true;
    });
  }

  onDelete(eventId) {
    // this.eventWatcherSubscription.unsubscribe();
    this._eventService.delete(eventId)
      .subscribe(
        () => this._router.navigate(['/turak']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }

  onEdit(eventId) {
    this._router.navigate(['/turak', eventId]);
  }

  private loadEvent(itId: string) {
    const handle404 = () => {
      this._router.navigate(['404']);
    };

    this.event$ = this._eventService.getEventById(itId).share();
    this.eventWatcherSubscription = this.event$.subscribe(ev => {
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
    });
  }

  clicked(index) {
    this.swiperIndex = index;
    this.showImageSwiper = true;
  }
}

