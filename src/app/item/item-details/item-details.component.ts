import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {priceValidator} from './item.validators';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {EventModel} from '../../shared/event-model';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  public item: ItemModel;
  public itemCategories;
  public currentUser: UserModel;
  public form: FormGroup;
  public submitted = false;
  private _subscription: Subscription;

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _userService: UserService,
              private _fb: FormBuilder) {

  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnInit() {

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

    this._subscription = this._userService.isLoggedIn$
      .flatMap((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          console.log(isLoggedIn);
          return this._userService.getCurrentUser();
        } else {
          return Observable.of(null);
        }
      })
      .flatMap((user: UserModel) => {
        if (user === null) {
          return Observable.of(null);
        } else {
          this.currentUser = user;
          const itId = this._route.snapshot.params['id'];
          if (itId) {
            return this._itemService.getItemById(itId);
          } else {
            return Observable.of(new EventModel());
          }
        }
      }).subscribe((item: ItemModel) => {
        console.log(item);
        if (event === null) {
          if (this.currentUser.id) {
            this._router.navigate(['404']);
          } else {
            this._router.navigate(['/cuccok']);
          }
        } else {
          this.item = item;
          if (this.item.creatorId === this.currentUser.id) {
            fillForm();
          } else {
            this._router.navigate(['/cuccok/new']);
          }
        }
      });

    const fillForm = () => {
      this.form.patchValue({
        title: this.item.title,
        price: this.item.price,
        shortDescription: this.item.shortDescription,
        description: this.item.description,
        category: this.item.category,
        picUrl: this.item.picUrl
      });
    };

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

  onDelete(itemId: string) {
    this._itemService.delete(itemId)
      .subscribe(
        () => this._router.navigate(['/cuccok']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }

  onCategoryClick(item) {
    this.form.patchValue({
      category: item.currentTarget.getElementsByTagName('p')[0].innerHTML
    });
  }
}
