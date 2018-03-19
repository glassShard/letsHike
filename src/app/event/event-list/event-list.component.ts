import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import {CategoryService} from '../../shared/category.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../shared/user.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {

  public eventCategories;
  public currentUserId: string;
  public eventsGrouppedBy2$: Observable<EventModel[][]>;
  public newButton = 'Új túra';
  public title = 'Túrák';
  private stringFromSearch$ = new BehaviorSubject(null);
  private category$ = new BehaviorSubject(null);
  private _subscriptions: Subscription[] = [];

  constructor(private _eventService: EventService,
              private _categoryService: CategoryService,
              private _userService: UserService) {}

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.eventsGrouppedBy2$ = this._eventService.getAllEvents()
      .flatMap(rawEvent => {
        return Observable.of(
          rawEvent.sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;
            return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
          })
        );
      })
      .switchMap(events => {
        return this.category$
          .map(cat => {
            if (cat === null) {
              return events;
            } else {
              return events.filter(ev => {
                return ev.category === cat;
              });
            }
          });
      })
      .switchMap(events => {
        return this.stringFromSearch$
        // oldalbetöltéskor is kétszer futtatja a
        // console.logot két sorral ez alatt.
          .map(filteredText => {
            console.log(filteredText);
            if (filteredText === null) {
              return events;
            } else {
              return events.filter(event => {
                return (event.title.toLowerCase().indexOf(filteredText.toLowerCase()) > -1);
              });
            }
          });
      })
      .map(data => {
        return data.reduce((acc, curr: EventModel, ind: number) => {
          if (ind % 2 === 0) {
            acc.push([]);
          }
          acc[acc.length - 1].push(curr);
          return acc;
        }, [])
          .reduce((acc, curr, ind) => {
            if (ind % 2 === 0) {
              acc.push([]);
            }
            acc[acc.length - 1].push(curr);
            return acc;
          }, []);
      });

    this._categoryService.getEventCategories().subscribe(res => this.eventCategories = res);

    this._subscriptions.push(this._userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.currentUserId = this._userService.currentUserId;
      } else {
        this.currentUserId = null;
      }
    }));
  }

  addSeen(eventId: string): void {
    this._eventService.getEventByIdOnce(eventId)
      .switchMap(ev => {
        const seen = ev.seen ? ++ ev.seen : 1;
        return this._eventService.addSeen(ev.id, seen);
      }).subscribe();
  }

  assignText(text) {
    this.stringFromSearch$.next(text);
  }

  chooseCategory(category) {
    this.category$.next(category);
  }

}
