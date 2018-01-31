import { Component, OnInit } from '@angular/core';
import {EventService} from '../shared/event.service';
import {ItemService} from '../shared/item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public items: number;
  public events: number;
  constructor(private _eventService: EventService,
               private _itemService: ItemService) { }

  ngOnInit() {
    this._itemService.getAllItems().subscribe(items => this.items = items.length);
    this._eventService.getAllEvents().subscribe(events => this.events = events.length);
  }

}
