import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ActivatedRoute, Router} from '@angular/router';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import 'rxjs/add/operator/concat';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  public event: EventModel;
  public currentUser: UserModel;
  public isGuest = false;
  public joinSuccessAlert = false;
  public dangerAlert = false;
  public deleteJoinSuccessAlert = false;
  buttonDisabled = false;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _userService: UserService) {
    if (this._userService.isLoggedIn) {
      this._userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  ngOnInit() {
    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this.reloadEvent(itId);
    } else {
      this.event = EventModel.emptyEvent;
    }
  }

  private reloadEvent(itId: string) {
    const handle404 = () => {
      this._router.navigate(['404']);
    };
    this._eventService.getEventById(itId).subscribe(ev => {
      if (ev === null) {
        handle404();
      } else {
        this.buttonDisabled = false;
        this.event = ev;
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

  onJoin(userId: string, eventId: string) {
    this.buttonDisabled = true;
    this.joinSuccessAlert = false;
    this.dangerAlert = false;
    this._eventService.join(userId, eventId).subscribe(() => {
      this.joinSuccessAlert = true;
      console.log(this.joinSuccessAlert);
      this.reloadEvent(eventId);
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
      this.reloadEvent(eventId);
    }, () => {
      this.dangerAlert = true;
    });
  }

  onDelete(eventId) {
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
}

