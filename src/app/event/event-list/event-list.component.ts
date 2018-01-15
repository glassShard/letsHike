import { Component, OnInit } from '@angular/core';
import {EventModel} from '../../shared/event-model';
import {EventService} from '../../shared/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  isCollapsed = true;
  public eventsGrouppedBy2: EventModel[];

  constructor(private _eventService: EventService) {}

  ngOnInit() {
    this.eventsGrouppedBy2 = this._eventService.getAllEvents()
      .reduce((acc, curr: EventModel, ind: number) => {
        if (ind % 2 === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(curr);
        return acc;
      }, [])
      .reduce((acc, curr, ind) => {
        if (ind % 2 === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(curr);
        return acc;
      }, []);

    console.log(this.eventsGrouppedBy2);
  }

}
