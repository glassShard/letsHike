 import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import {UserService} from '../../shared/user.service';
import 'rxjs/add/observable/fromEvent';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import {Subscription} from 'rxjs/Subscription';
import {UserModel} from '../../shared/user-model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit, OnDestroy {

  public itemsGrouppedBy2$: Observable<ItemModel[]>;
  public itemCategories;
  public currentUser$: Observable<UserModel>;
  public newButton = 'Új cucc';
  public title = 'Cuccok';
  private stringFromSearch$ = new BehaviorSubject(null);
  private category$ = new BehaviorSubject(null);
  private _subscriptions: Subscription[] = [];

  constructor(private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _userService: UserService) {}

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this._categoryService.getItemCategories().subscribe(res => this.itemCategories = res);

    this._subscriptions.push(this._userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.currentUser$ = this._userService.getCurrentUser();
      } else {
        this.currentUser$ = Observable.of(null);
      }
    }));

    this.itemsGrouppedBy2$ = this._itemService.getAllItems()
      .flatMap(rawItems => {
        return Observable.of(
          rawItems.sort((a, b) => {
            const dateA = a.dateOfPublish;
            const dateB = b.dateOfPublish;
            return (dateA > dateB) ? -1 : (dateA < dateB) ? 1 : 0;
          })
        );
      })
      .switchMap(items => {
        return this.category$
          .map(cat => {
            if (cat === null) {
              return items;
            } else {
              return items.filter(ev => {
                return ev.category === cat;
              });
            }
          });
      })
      .switchMap(items => {
        return this.stringFromSearch$
          .map(filteredText => {
            if (filteredText === null) {
              return items;
            } else {
              return items.filter(item => {
                return (item.title.toLowerCase().indexOf(filteredText.toLowerCase()) > -1
                  || item.shortDescription.toLowerCase().indexOf(filteredText.toLowerCase()) > -1);
              });
            }
          });
      })
      .map(data => {
        return data.reduce((acc, curr: ItemModel, ind: number) => {
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

