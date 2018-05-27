import {Component, OnDestroy, OnInit, Renderer2, TemplateRef} from '@angular/core';
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
import {ChatListModel} from '../../chat/model/chat-list.model';
import {OpenChatListService} from '../../shared/open-chat-list.service';
import {VerifyEmailComponent} from '../../verify-email/verify-email.component';

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
  public favEvents: string[] = [];
  public recipientsId: string[] = [];
  public emailModalTitle: string;
  public modalRef: BsModalRef;
  private watchedUser: UserModel;
  private _subscriptions: Subscription[] = [];

  constructor(private _userService: UserService,
              private _route: ActivatedRoute,
              private _eventService: EventService,
              private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _renderer: Renderer2,
              private _modalService: BsModalService,
              private _openChatListService: OpenChatListService) {
  }

  ngOnDestroy() {
    this.unsubscribe(this._subscriptions);
  }

  ngOnInit() {
    const userId = this._route.snapshot.params['id'];
    this.watchedUser$ = this._userService.getUserById(userId).share();

    this._subscriptions.push(this._userService.isLoggedIn$
      .switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this._userService.getCurrentUser();
        } else {
          return Observable.of(null);
        }
      })
      .switchMap(currentUser => {
        this.currentUser = currentUser;
        return this.watchedUser$;
      })
      .subscribe(user => {
        this.watchedUser = user;
        this.favEvents = user.favEvents ? Object.keys(user.favEvents) : ['Nincs' +
        ' kitöltve'];

        this._categoryService.getItemCategories().subscribe(res => this.itemCategories = res);
        this._categoryService.getEventCategories().subscribe(res => this.eventCategories = res);

        this.allEvents$ = this._eventService.getAllEvents();

        const sortAndGroup = (param) => {
          let filtered;
          let sorted;
          if (param === 'userEvents') {
            filtered = this.allEvents$
              .map(events => events.filter(event => event.creatorId === this.watchedUser.id))
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
              .map(items => items.filter(item => item.creatorId === this.watchedUser.id))
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
      })
    );
  }

  setHeight(el, height) {
    this._renderer.setStyle(el, 'height', height + 'px');
  }

  addSeen(eventId: string): void {
    const subscription = this._eventService.getEventByIdOnce(eventId)
      .switchMap(ev => {
        const seen = ev.seen ? ++ev.seen : 1;
        return this._eventService.addSeen(ev.id, seen);
      }).subscribe(() => subscription.unsubscribe());
  }

  showEmailModalWindow(template: TemplateRef<any>) {
    this.emailModalTitle = `Email ${this.watchedUser.nick} részére`;
    this.recipientsId = [this.watchedUser.id];
    this.modalRef = this._modalService.show(template);
  }

  emailClicked(template: TemplateRef<any>) {
    if (this.currentUser.emailVerified) {
      this.showEmailModalWindow(template);
    } else {
      this.modalRef = this._modalService.show(VerifyEmailComponent);
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  openChat() {
    const friend = new ChatListModel({
      $id: this.watchedUser.id,
      nick: this.watchedUser.nick,
      picUrl: this.watchedUser.picUrl
    });
    this._openChatListService.setOpenChat(friend);
  }

  unsubscribe(subscriptions: Subscription[]) {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

