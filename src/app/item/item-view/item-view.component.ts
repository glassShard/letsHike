import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  public item: ItemModel;
  public currentUser: UserModel;
  public root = environment.links.root;

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _userService: UserService) {
    _userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this._userService.getCurrentUser()
          .subscribe(user => this.currentUser = user);
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnInit() {
    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this._itemService.getItemById(itId).subscribe(it => this.item = it);
    } else {
      this.item = new ItemModel();
    }
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
