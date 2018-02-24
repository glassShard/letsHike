import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EventService} from '../../shared/event.service';
import {EventModel} from '../../shared/event-model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../shared/category.service';
import {Location} from '@angular/common';
import {UserService} from '../../shared/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {futureValidator} from './event.validators';
import {UserModel} from '../../shared/user-model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import {Subscription} from 'rxjs/Subscription';
import {ImgComponent} from '../../shared/img/img/img.component';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  @ViewChild(ImgComponent) private _imgComponent: ImgComponent;
  public event: EventModel;
  public eventCategories;
  public eventForm: FormGroup;
  public submitted = false;
  public currentUser: UserModel;
  private _subscriptions: Subscription[] = [];
  public error: string;
  public success: string;
  public oldCoverImg = '';
  public uploadedImages: any[] = [];
  private _root = environment.links.root;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _location: Location,
              private _userService: UserService,
              private _fb: FormBuilder) {}

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.eventForm = this._fb.group(
      {
        title: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(25)])],
        days: [null, Validators.compose([
          Validators.required,
          Validators.min(1)
        ])],
        country: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(25)])],
        region: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(50)])],
        date: [null, Validators.compose([
          Validators.required,
          futureValidator
        ])],
        description: ['', Validators.required],
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
        console.log(user);
        if (user === null) {
          return Observable.of(null);
        } else {
          this.currentUser = user;
          const evId = this._route.snapshot.params['id'];
          if (evId) {
            return this._eventService.getEventById(evId);
          } else {
            return Observable.of(new EventModel());
          }
        }
      }).subscribe((event: EventModel) => {
        console.log(event);
        if (event === null) {
          if (this.currentUser.id) {
            this._router.navigate(['404']);
          } else {
            this._router.navigate(['/turak']);
          }
        } else {
          this.event = event;
          if (this.event.images) {
            this.uploadedImages = this.event.images.split(',')
              .map(imageUrl => `${this._root}${imageUrl}`);
          }
          if (this.event.picUrl) {
            this.oldCoverImg = this.event.picUrl;
          }
          if (this.event.creatorId === this.currentUser.id) {
            fillForm();
          } else {
            this._router.navigate(['/turak/new']);
          }
        }
      }));

    const fillForm = () => {
      let date: string = null;
      if (this.event.date) {
        const unixDate = new Date(this.event.date * 1000);
        date = unixDate.toJSON().substr(0, 10);
      }
      this.eventForm.patchValue({
        title: this.event.title,
        days: this.event.days,
        country: this.event.country,
        region: this.event.region,
        date: date,
        description: this.event.description,
        category: this.event.category,
        picUrl: this.event.picUrl,
        images: this.event.images
      });
    };

    this.eventCategories = this._categoryService.getEventCategories();
  }

  onSubmit() {
    this.clearError();
    delete(this.success);
    this.submitted = true;
    if (this.eventForm.valid) {
      Object.assign(this.event, this.eventForm.value);
      const date = new Date(this.eventForm.get('date').value).getTime() / 1000;
      Object.assign(this.event, {date: date});
      console.log(this.event);
      this._subscriptions.push(this._eventService.save(this.event)
        .subscribe(
          (response: EventModel) => {
            this.event.id = response.id;
            this._imgComponent.saveImages(this.event.id);
            // this._router.navigate(['/turak']);
          },
          (error => this.error = 'Hiba az adatok mentése közben. Kérjük,' +
          ' próbáld újra.')
        )
      );
    }
  }
  onDelete(eventId) {
    this._eventService.delete(eventId)
      .subscribe(
        () => this._router.navigate(['/turak']),
        (err) => {
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }

  onCategoryClick(event) {
    this.eventForm.patchValue({
      category: event.currentTarget.getElementsByTagName('p')[0].innerHTML
    });
  }

  clearError() {
    delete(this.error);
  }

  filesChange(images) {
    this.eventForm.get('imagesToUpload').setValue(images);
  }

  setAlert(event) {
    this.submitted = false;
    if (event.type === 'success') {
      this.success = event.value;
    }
    if (event.type === 'error') {
      this.error = event.value;
    }
  }
}

