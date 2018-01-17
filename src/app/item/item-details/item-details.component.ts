import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {UserService} from '../../shared/user.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  public item: ItemModel;
  public itemCategories;
  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _userService: UserService) { }

  ngOnInit() {
    const itId = +this._route.snapshot.params['id'];
    this.item = this._itemService.getItemById(itId);
    this.itemCategories = this._categoryService.getItemCategories();
  }

  onSubmit(form) {
    if (this.item.id) {
      this._itemService.update(this.item);
    } else {
      this.item.creatorId = this._userService.getCurrentUser().id;
      this._itemService.create(this.item);
    }
    this._router.navigate(['/cuccok']);
  }

}
