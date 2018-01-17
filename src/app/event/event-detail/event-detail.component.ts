import { Component, OnInit } from '@angular/core';
import {EventService} from '../../shared/event.service';
import {EventModel} from '../../shared/event-model';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../shared/category.service';
import {Location} from '@angular/common';
import {UserService} from '../../shared/user.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  public event: EventModel;
  public eventCategories;
  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _location: Location,
              private _userService: UserService) { }

  ngOnInit() {
    this.eventCategories = this._categoryService.getEventCategories();
    const evId = +this._route.snapshot.params['id'];
    // console.log('id=', typeof(evId), ':', evId);
    // if (evId) {
    this.event = this._eventService.getEventById(evId);
    // } else {
    //   this.event = new EventModel(EventModel.emptyEvent);
    // }
    console.log(this.event);
  }

  onSubmit(form) {
    if (this.event.id) {
      console.log('modosit agban vagyunk');
      this._eventService.update(this.event);
    } else {
      console.log('new agban vagyunk');
      this.event.creatorId = this._userService.getCurrentUser().id;
      this._eventService.create(this.event);
    }
    console.log(form);
    this._location.back();
  }

}
