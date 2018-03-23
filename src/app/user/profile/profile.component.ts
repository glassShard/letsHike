import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
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
import {element} from 'protractor';

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
  public isCollapsed1 = true;
  public isCollapsed2 = true;
  public isCollapsed3 = true;
  public isCollapsed4 = true;
  public isCollapsed5 = true;
  public favItems: {};
  public favEvents: {};

  constructor(private _userService: UserService,
              private _eventService: EventService,
              private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _renderer: Renderer2) {}

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

    this.user$.first()
      .flatMap(user => {
        this.favItems = user.favItems;
        this.favEvents = user.favEvents;
        return Observable.combineLatest(
          this._categoryService.getEventCategories(),
          this._categoryService.getItemCategories(),
          (eCats, iCats) => {
            const setChecked = (favSgs, sgCats) => {
              let src: {checked: boolean};
              if (favSgs) {
                sgCats.map(sgCat => {
                  if (Object.keys(favSgs).filter(favSg => favSg === sgCat.category).length > 0) {
                    src = {checked: true};
                  } else {
                    src = {checked: false};
                  }
                  Object.assign(sgCat, src);
                });
                return sgCats;
              } else {
                return sgCats.map(sgCat => Object.assign(sgCat, {checked: false}));
              }
            };
            this.eventCategories = setChecked(this.favEvents, eCats);
            this.itemCategories = setChecked(this.favItems, iCats);
          });
      }).subscribe();
  }

  setHeight(el, height) {
    this._renderer.setStyle(el, 'height', height + 'px');
  }

  addSeen(eventId: string): void {
    this._eventService.getEventByIdOnce(eventId)
      .switchMap(ev => {
        const seen = ev.seen ? ++ ev.seen : 1;
        return this._eventService.addSeen(ev.id, seen);
      }).subscribe();
  }

  onCategoryClick(whereFrom, what, checked) {
    console.log(what, checked);
    this._userService.saveCategory(whereFrom, what, checked);
  }
}

// TODO: profilkép módosítás utáni oldalbetöltéskor nem frissíti a képet
