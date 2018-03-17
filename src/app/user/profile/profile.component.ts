import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import {CategoryService} from '../../shared/category.service';
import {ItemService} from '../../shared/item.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$: Observable<UserModel>;
  public joinedEventsGrouppedBy2$: Observable<EventModel[][]>;
  public myEventsGrouppedBy2$: Observable<EventModel[][]>;
  public myItemsGrouppedBy2$: Observable<EventModel[][]>;
  public eventCategories;
  public itemCategories;
  private allEvents: Observable<EventModel[]>;
  public currentUserId: string;

  constructor(private _userService: UserService,
              private _eventService: EventService,
              private _itemService: ItemService,
              private _categoryService: CategoryService) {}


  ngOnInit() {
    this.user$ = this._userService.getCurrentUser();
    this.currentUserId = this._userService.currentUserId;

    this.allEvents = this._eventService.getAllEvents();

    const sortAndGroup = (param) => {
      let filtered;
      let sorted;
      if (param === 'joined' || param === 'myEvents') {
        if (param === 'joined') {
          filtered = this.allEvents
            .map(events => events.filter(event => event.guestsIds && event.guestsIds.hasOwnProperty(this.currentUserId)))
            .do(res => console.log(res));
        }
        if (param === 'myEvents') {
          filtered = this.allEvents
            .map(events => events.filter(event => event.creatorId === this.currentUserId));
        }
        sorted = filtered
          .flatMap(rawEvent => {
            return Observable.of(
              rawEvent.sort((a, b) => {
                const dateA = a.date;
                const dateB = b.date;
                return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
              })
            );
          });
      } else if (param === 'myItems') {
        sorted = this._itemService.getAllItems()
          .map(events => events.filter(event => event.creatorId === this.currentUserId))
          .flatMap(rawItems => {
            return Observable.of(
              rawItems.sort((a, b) => {
                const dateA = a.dateOfPublish;
                const dateB = b.dateOfPublish;
                return (dateA > dateB) ? -1 : (dateA < dateB) ? 1 : 0;
              })
            );
          });
      }
      return sorted
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
    };

    this.joinedEventsGrouppedBy2$ = sortAndGroup('joined');

    this.myEventsGrouppedBy2$ = sortAndGroup('myEvents');

    this.myItemsGrouppedBy2$ = sortAndGroup('myItems');

    this.eventCategories = this._categoryService.getEventCategories();
    this.itemCategories = this._categoryService.getItemCategories();

  }
}

// TODO: profilkép módosítás utáni oldalbetöltéskor nem frissíti a képet
