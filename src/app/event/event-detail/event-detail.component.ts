import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  public event: EventModel;
  public eventCategories;
  public eventForm: FormGroup;
  public submitted = false;
  public currentUser: UserModel;
  private subscription: Subscription;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _location: Location,
              private _userService: UserService,
              private _fb: FormBuilder) {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this._userService.isLoggedIn$
      .flatMap(isLoggedIn => {
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
      }).subscribe(event => {
        console.log(event);
        if (event === null) {
          if (this.currentUser.id) {
            this._router.navigate(['404']);
          } else {
            this._router.navigate(['/login']);
          }
        } else {
          this.event = event;
          if (this.event.creatorId === this.currentUser.id) {
            fillForm();
          } else {
            this._router.navigate(['/turak/new']);
          }
        }
      });

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
        picUrl: ''
      }
    );

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
        picUrl: this.event.picUrl
      });
    };

    this.eventCategories = this._categoryService.getEventCategories();
  }

  onSubmit() {
    this.submitted = true;
    if (this.eventForm.valid) {
      Object.assign(this.event, this.eventForm.value);
      const date = new Date(this.eventForm.get('date').value).getTime() / 1000;
      Object.assign(this.event, {date: date});
      console.log(this.event);
      this._eventService.save(this.event).subscribe(() => {
        this._router.navigate(['/turak']);
      }, error => console.log(error));
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
}

