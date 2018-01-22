import {Component, OnInit} from '@angular/core';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';
import {CategoryService} from '../../shared/category.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../shared/user.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  isCollapsed = true;
  public eventCategories;
  public currentUserId: string;
  public events: EventModel[];
  public eventsGrouppedBy2$: Observable<EventModel[][]>;

  constructor(private _eventService: EventService,
              private _categoryService: CategoryService,
              private _userService: UserService) {
    this.currentUserId = this._userService.currentUserId;
  }

  ngOnInit() {
    this.eventCategories = this._categoryService.getEventCategories();
    this.eventsGrouppedBy2$ = this._eventService.getAllEvents()
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

    this._eventService.getAllEvents()
      .subscribe(data => this.events = data);

    // this.eventsGrouppedBy2 = this._eventService.getAllEvents()
    //   .reduce((acc, curr: EventModel, ind: number) => {
    //     if (ind % 2 === 0) {
    //       acc.push([]);
    //     }
    //     acc[acc.length - 1].push(curr);
    //     return acc;
    //   }, [])
    //   .reduce((acc, curr, ind) => {
    //     if (ind % 2 === 0) {
    //       acc.push([]);
    //     }
    //     acc[acc.length - 1].push(curr);
    //     return acc;
    //   }, []);
    //
    // console.log(this.eventsGrouppedBy2);
  }

}
