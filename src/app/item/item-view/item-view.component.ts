import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  public item: ItemModel;
  public currentUser: UserModel;

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _userService: UserService) {
    if (this._userService.isLoggedIn) {
      this._userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  ngOnInit() {
    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this._itemService.getItemById(itId).subscribe(it => this.item = it);
    } else {
      this.item = ItemModel.emptyItem;
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
