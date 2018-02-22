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
import {FileService} from '../../shared/file.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';

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
  private _subscriptions: Subscription[] = [];
  public error: string;
  public success: string;
  private _markedImgIndex = -1;
  private _coverImg = '';
  public coverFromSaved = true; // borítókép kiválasztáshoz toggle változó
  public oldCoverImg = '';
  public uploadedImages: any[] = [];
  private _root = 'http://localhost/turazzunk/';

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _userService: UserService,
              private _fileService: FileService,
              private _fb: FormBuilder) {}

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
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
        picUrl: '',
        images: '',
        imagesToUpload: null
      }
    );

    this._subscriptions.push(this._userService.isLoggedIn$
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
        if (item === null) {
          if (this.currentUser.id) {
            this._router.navigate(['404']);
          } else {
            this._router.navigate(['/cuccok']);
          }
        } else {
          this.item = item;
          if (this.item.images) {
            this.uploadedImages = this.item.images.split(',')
              .map(imageUrl => `${this._root}${imageUrl}`);
          }
          if (!this.item.picUrl) {
            this._markedImgIndex = 0;
          } else {
            this.oldCoverImg = this.item.picUrl;
            console.log(this.oldCoverImg);
          }
          if (this.item.creatorId === this.currentUser.id) {
            fillForm();
          } else {
            this._router.navigate(['/cuccok/new']);
          }
        }
      }));

    const fillForm = () => {
      this.form.patchValue({
        title: this.item.title,
        price: this.item.price,
        shortDescription: this.item.shortDescription,
        description: this.item.description,
        category: this.item.category,
        picUrl: this.item.picUrl,
        images: this.item.images
      });
    };

    this.itemCategories = this._categoryService.getItemCategories();
  }

  onSubmit() {
    this.clearError();
    delete(this.success);
    this.submitted = true;
    if (this.form.valid) {
      Object.assign(this.item, this.form.value);
      this.saveChanges();
    }
  }

  saveChanges() {
    let stream = Observable.of(null);
    if (this.form.get('imagesToUpload').value) {
      const formModel = this.prepareSave(this.item.id);
      if (Object.values(this.form.get('imagesToUpload').value)
          .map((curr) => curr['size'])
          .reduce((acc, curr) => acc + curr) > 32000000) {
        this.doIfTooBigPost();
      } else {
        if (this._coverImg && this.oldCoverImg !== `cover_${this._coverImg}`) {
          stream = (this._fileService.setCoverImage(
            this.item.id,
            'items',
            this._coverImg.replace(this._root, '')
          )
          .do(coverImg => {
            if (coverImg.url) {
              this.item.picUrl = `${coverImg.url}`;
            } else {
              this.doIfFailed('Hiba a borítókép beállításánál. Kérjük,' +
                ' próbáld újra');
            }
          })
          .flatMap(() => this._itemService.save(this.item))
          .flatMap(() => {
            return this._fileService.uploadImages(
              this.item.id,
              formModel,
              'items',
              this.item.images
            );
          }));
        } else {
          stream = (this._itemService.save(this.item)
            .flatMap(() => {
              return this._fileService.uploadImages(
                this.item.id,
                formModel,
                'items',
                this.item.images
              );
            })
          );
        }
      }
    } else {
      if (this._coverImg && this.oldCoverImg !== `cover_${this._coverImg}`) {
        stream = this._fileService.setCoverImage(
          this.item.id,
          'items',
          this._coverImg.replace(this._root, '')
        )
        .do(coverImg => {
          if (coverImg.url) {
            this.item.picUrl = `${coverImg.url}`;
          } else {
            this.doIfFailed('Hiba a borítókép beállításánál. Kérjük,' +
              ' próbáld újra');
          }
        })
        .flatMap(() => this._itemService.save(this.item));
       } else {
        stream = this._itemService.save(this.item);
      }
    }
    this._subscriptions.push(stream.subscribe((response) => {
      console.log(response);
      if (response.error) {
        this.doIfFailed('Hiba a képek feltöltésénél. Kérjük próbáld újra.');
      } else {
        this.doIfSuccess();
        // this._router.navigate(['/cuccok']);
      }
    }, error => {
      console.warn(error);
      this.doIfFailed('Hiba az adatok mentésekor. Kérjük, próbáld újra.');
    }));
  }

  private prepareSave(id): FormData {
    const input = new FormData();
    input.append('id', id);
    input.append('whereTo', 'items');
    input.append('markedImageIndex', this._markedImgIndex.toString());
    console.log(this._markedImgIndex);
    Object.values(this.form.get('imagesToUpload').value).map(image => {
      input.append('imagesToUpload[]', image);
    });
    return input;
  }

  deleteImage(imgUrl) {
    const index = this.uploadedImages.indexOf(imgUrl);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
    }
    this.item.images = this.uploadedImages
      .map(img => img.replace(this._root, ''))
      .join();
    this.form.patchValue({
      images: this.item.images
    });
    const urlToDelete = imgUrl.replace(this._root, '');
    this._fileService.deleteImage(this.item.id, 'items', urlToDelete, this.item.images)
      .subscribe();
  }

  doIfTooBigPost() {
    this.error = 'A feltölteni kívánt fájlok maximális mérete 32MB lehet. A' +
      ' te képeid összesített mérete ezt meghaladja. Kérjük,' +
      ' tartsd be a limitet.';
  }

  doIfSuccess() {
    this.success = 'Az adatokat mentettük.';
    this.clearFileFromForm();
  }

  doIfFailed(error) {
    this.error = error;
  }

  clearFileFromForm() {
    this.form.get('imagesToUpload').setValue(null);
  }

  filesChange(images) {
    this.form.get('imagesToUpload').setValue(images);
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

  clearError() {
    delete(this.error);
  }

  setIndex(imgIndex) {
    this._coverImg = '';
    this.coverFromSaved = false;
    this._markedImgIndex = imgIndex;
  }

  setCoverImage(imgUrl) {
    this._markedImgIndex = -1;
    this.coverFromSaved = true;
    this._coverImg = imgUrl;
    console.log(imgUrl);
  }
}
