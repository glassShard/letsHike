import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import {CategoryService} from '../../shared/category.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../shared/user.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  public eventCategories;
  public currentUserId: string;
  public eventsGrouppedBy2$: Observable<EventModel[][]>;
  public newButton = 'Új túra';
  public title = 'Túrák';
  private stringFromSearch$ = new BehaviorSubject(null);
  private category$ = new BehaviorSubject(null);

  constructor(private _eventService: EventService,
              private _categoryService: CategoryService,
              private _userService: UserService) {
    this._userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.currentUserId = this._userService.currentUserId;
        // this._userService.getCurrentUser()
        //   .subscribe(user => this.currentUserId = user.id);
      }
    });
  }

  ngOnInit() {
    this.eventCategories = this._categoryService.getEventCategories();
    this.eventsGrouppedBy2$ = this._eventService.getAllEvents()
      .flatMap(events => {
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
      .flatMap(events => {
        return this.stringFromSearch$
          .map(filteredText => {
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
  }

  assignText(text) {
    this.stringFromSearch$.next(text);
  }

  chooseCategory(category) {
    this.category$.next(category);
  }

}
