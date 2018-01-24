import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {priceValidator} from './item.validators';

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
  public form: FormGroup;
  public submitted = false;

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _userService: UserService,
              private _fb: FormBuilder) {
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
    this.form = this._fb.group(
      {
        title: ['', Validators.required],
        price: [null, Validators.compose([
          Validators.required,
          priceValidator])
        ],
        shortDescription: '',
        description: '',
        category: ['', Validators.required],
        picUrl: ''
      }
    );

    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this._itemService.getItemById(itId).subscribe(it => {
        if (it === null) {
          handle404();
        } else {
          this.item = it;
          this.form.patchValue({
            title: this.item.title,
            price: this.item.price,
            shortDescription: this.item.shortDescription,
            description: this.item.description,
            category: this.item.category,
            picUrl: this.item.picUrl
          });
        }
      }, err => {
        handle404();
      });
    } else {
      this.item = ItemModel.emptyItem;
    }
    this.itemCategories = this._categoryService.getItemCategories();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      Object.assign(this.item, this.form.value);
      console.log(this.item);
      this._itemService.save(this.item).subscribe(() => {
      }, error => console.log(error));
      this._router.navigate(['/cuccok']);
    }
  }

  onDelete( ) {
    this._itemService.delete(this.item)
      .subscribe(
        () => this._router.navigate(['/cuccok']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }

  onCategoryClick(event) {
    this.form.patchValue({
      category: event.currentTarget.getElementsByTagName('p')[0].innerHTML
    });
  }
}
