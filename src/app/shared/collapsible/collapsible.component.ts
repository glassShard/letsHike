import {Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ItemModel} from '../item-model';
import {EventModel} from '../event-model';
import {UserModel} from '../user-model';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.css']
})
export class CollapsibleComponent implements OnInit {
  public isCollapsed = true;
  @Input() num: number;
  @Input() elements$: Observable<ItemModel[][] | EventModel[][]>;
  @Input() header: string;
  @Input() idNum: number;
  @Input() message: string;
  @Input() currentUserId: string;
  @Input() categories;
  @Input() elem: string;
  @Output() addSeen = new EventEmitter();

  constructor(private _renderer: Renderer2) { }

  ngOnInit() {
  }

  setHeight(el, height) {
    this._renderer.setStyle(el, 'height', height + 'px');
  }

  seen(eventId) {
    this.addSeen.emit({id: eventId});
  }
}
