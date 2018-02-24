import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserModel} from '../../shared/user-model';
import {EventModel} from '../../shared/event-model';
import {ItemModel} from '../../shared/item-model';

@Component({
  selector: 'app-owner-buttons',
  templateUrl: './owner-buttons.component.html',
  styleUrls: ['./owner-buttons.component.css']
})
export class OwnerButtonsComponent implements OnInit {
  @Input() currentUser: UserModel;
  @Input() model: EventModel | ItemModel;
  @Input() isOnEdit: boolean;
  @Input() submitted: boolean;
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() save = new EventEmitter();
  public showAlert = false;

  constructor() {
  }

  ngOnInit() {
  }

  onDelete(idFromButton) {
    this.delete.emit({idFromButton: idFromButton});
  }

  onEdit(idFromButton) {
    this.edit.emit({idFromButton: idFromButton});
  }

  onSave() {
    this.save.emit();
  }

}
