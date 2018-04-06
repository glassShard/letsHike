import {
  Component, OnDestroy, OnInit, Renderer2,
  TemplateRef
} from '@angular/core';
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
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/share';
import {Subscription} from 'rxjs/Subscription';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})

export class ProfilesComponent implements OnInit, OnDestroy {
  watchedUser$: Observable<UserModel>;
  public watchedUserEventsGrouppedBy2$: Observable<EventModel[][]>;
  public watchedUserItemsGrouppedBy2$: Observable<EventModel[][]>;
  public eventCategories;
  public itemCategories;
  public allEvents$: Observable<EventModel[]>;
  public eventsNum: number;
  public itemsNum: number;
  public currentUser: UserModel;
  public watchedUserId: string;
  private _watchedUserNick: string;
  private _watchedUserEmail: string;
  public isCollapsed2 = true;
  public isCollapsed3 = true;
  public favEvents: string[] = [];
  private _subscriptions: Subscription[] = [];
  public recipientsEmail: string[] = [];
  public emailModalTitle: string;
  public modalRef: BsModalRef;

  constructor(private _userService: UserService,
              private _route: ActivatedRoute,
              private _eventService: EventService,
              private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _renderer: Renderer2,
              private _modalService: BsModalService) {}

  ngOnDestroy() {
    this.unsubscribe(this._subscriptions);
  }

  ngOnInit() {
    this._subscriptions.push(this._userService.isLoggedIn$
      .flatMap(isLoggedIn => {
        if (isLoggedIn) {
          return this._userService.getCurrentUser();
        } else {
          return Observable.of(null);
        }
      }).subscribe(user => {
        this.currentUser = user;
      })
    );

    const userId = this._route.snapshot.params['id'];
    this.watchedUser$ = this._userService.getUserById(userId).share();
    this._subscriptions.push(this.watchedUser$.subscribe(user => {
      this.watchedUserId = user.id;
      this._watchedUserEmail = user.email;
      this._watchedUserNick = user.nick;
      this.favEvents = user.favEvents ? Object.keys(user.favEvents) : ['Nincs' +
      ' kitöltve'];
    }));

    this._categoryService.getItemCategories().subscribe(res => this.itemCategories = res);
    this._categoryService.getEventCategories().subscribe(res => this.eventCategories = res);

    this.allEvents$ = this._eventService.getAllEvents();

    const sortAndGroup = (param) => {
      let filtered;
      let sorted;
      if (param === 'userEvents') {
        filtered = this.allEvents$
          .map(events => events.filter(event => event.creatorId === this.watchedUserId))
          .do(events => this.eventsNum = events.length);
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
      } else if (param === 'userItems') {
        sorted = this._itemService.getAllItems()
          .map(items => items.filter(item => item.creatorId === this.watchedUserId))
          .do(items => this.itemsNum = items.length)
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

    this.watchedUserEventsGrouppedBy2$ = sortAndGroup('userEvents');

    this.watchedUserItemsGrouppedBy2$ = sortAndGroup('userItems');
  }

  setHeight(el, height) {
    this._renderer.setStyle(el, 'height', height + 'px');
  }

  addSeen(eventId: string): void {
    const subscription = this._eventService.getEventByIdOnce(eventId)
      .switchMap(ev => {
        const seen = ev.seen ? ++ ev.seen : 1;
        return this._eventService.addSeen(ev.id, seen);
      }).subscribe(() => subscription.unsubscribe());
  }

  showEmailModalWindow(template: TemplateRef<any>) {
    this.emailModalTitle = `Email ${this._watchedUserNick} részére`;
    this.recipientsEmail = [this._watchedUserEmail];
    this.modalRef = this._modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  unsubscribe(subscriptions: Subscription[]) {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

