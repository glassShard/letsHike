import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit, OnDestroy {
  public item: ItemModel;
  public currentUser: UserModel;
  public root = environment.links.root;
  private _subscriptions: Subscription[] = [];

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _userService: UserService) {}

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

    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this._subscriptions.push(this._itemService.getItemById(itId).subscribe(it => this.item = it));
    } else {
      this.item = new ItemModel();
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  onDelete(itemId) {
    this._itemService.delete(itemId)
      .subscribe(
        () => this._router.navigate(['/cuccok']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }

  onEdit(itemId) {
    this._router.navigate(['/cuccok', itemId]);
  }
}
