import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  public item: ItemModel;
  public itemCategories;
  public currentUser: UserModel;
  public showAlert = false;
  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _userService: UserService) {
    if (this._userService.isLoggedIn) {
      this._userService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  ngOnInit() {
    const handle404 = () => {
      this._router.navigate(['404']);
    };
    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this._itemService.getItemById(itId).subscribe(it => {
        if (it === null) {
          handle404();
        } else {
          this.item = it;
        }
      }, err => {
        handle404();
      });
    } else {
      this.item = ItemModel.emptyItem;
    }
    this.itemCategories = this._categoryService.getItemCategories();
  }

  onSubmit(form) {
    this._itemService.save(this.item);
    this._router.navigate(['/cuccok']);
  }

  onDelete(item) {
    this._itemService.delete(this.item)
      .subscribe(
        () => this._router.navigate(['/cuccok']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }
}
