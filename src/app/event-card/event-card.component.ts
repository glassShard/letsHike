import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {EventModel} from '../shared/event-model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() tura: EventModel;
  @Input() currentUserId: string;
  @Output() addSeen = new EventEmitter();
  @Input() categories;
  public dafaultPic: string;
  constructor() { }

  ngOnInit() {
    this.dafaultPic = this.categories.filter(cat => cat.category === this.tura.category)[0].picUrl;
    console.log(this.categories.filter(cat => cat.category === this.tura.category)[0].picUrl);
  }

  onViewClick() {
    if (!(this.currentUserId && this.currentUserId === this.tura.creatorId)) {
      this.addSeen.emit({id: this.tura.id});
    }
  }

}
