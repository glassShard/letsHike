import { Component, OnInit } from '@angular/core';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  isCollapsed = true;
  public itemsGrouppedBy2$: Observable<ItemModel[]>;
  public itemCategories;
  public currentUser: UserModel;

  constructor(private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _userService: UserService) {
    if (this._userService.isLoggedIn) {
      this._userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  ngOnInit() {
    this.itemCategories = this._categoryService.getItemCategories();
    this.itemsGrouppedBy2$ = this._itemService.getAllItems()
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
}

