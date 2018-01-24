import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserModel} from '../../shared/user-model';
import {EventModel} from '../../shared/event-model';

@Component({
  selector: 'app-owner-buttons',
  templateUrl: './owner-buttons.component.html',
  styleUrls: ['./owner-buttons.component.css']
})
export class OwnerButtonsComponent implements OnInit {
  @Input() currentUser: UserModel;
  @Input() event: EventModel;
  @Output() delete = new EventEmitter<string>();
  public showAlert = false;

  constructor() {
  }

  onDelete(eventId) {
    this.delete.emit(eventId);
  }

  ngOnInit() {
  }

}
