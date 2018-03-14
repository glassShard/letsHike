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


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$: Observable<UserModel>;
  public eventsGrouppedBy2$: Observable<EventModel[][]>;
  public eventCategories;

  constructor(private _userService: UserService,
              private _eventService: EventService,
              private _categoryService: CategoryService) {}


  ngOnInit() {
    this.user$ = this._userService.getCurrentUser();
    const currentUserId = this._userService.currentUserId;

    this.eventsGrouppedBy2$ = this._eventService.getAllEvents()
      .map(events => events.filter((event) => event.guestsIds && event.guestsIds.hasOwnProperty(currentUserId)))
      .flatMap(rawEvent => {
        return Observable.of(
          rawEvent.sort((a, b) => {
            const dateA = a.date;
            const dateB = b.date;
            return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
          })
        );
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

    this.eventCategories = this._categoryService.getEventCategories();

  }
}

// TODO: profilkép módosítás utáni oldalbetöltéskor nem frissíti a képet
