import { Component, OnInit } from '@angular/core';
import {EventService} from '../../shared/event.service';
import {EventModel} from '../../shared/event-model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../shared/category.service';
import {Location} from '@angular/common';
import {UserService} from '../../shared/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {futureValidator} from './event.validators';
import {UserModel} from '../../shared/user-model';


@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  public event: EventModel;
  public eventCategories;
  public eventForm: FormGroup;
  public submitted = false;
  public currentUser: UserModel;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _location: Location,
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
          Validators.maxLength(25)])],
        date: [null, Validators.compose([
          Validators.required,
          futureValidator
        ])],
        description: ['', Validators.required],
        category: ['', Validators.required],
        picUrl: ''
      }
    );

    const evId = this._route.snapshot.params['id'];
    if (evId) {
      this._eventService.getEventById(evId)
        .subscribe(evm => {
          if (evm === null) {
            handle404();
          } else {
            this.event = evm;
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
          }
        }, () => {
          handle404();
        });
    } else {
      this.event = new EventModel(EventModel.emptyEvent);
    }
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
