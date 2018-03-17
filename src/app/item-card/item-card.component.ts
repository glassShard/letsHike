import {
  AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck, Input,
  OnChanges,
  OnInit, SimpleChanges
} from '@angular/core';
import {ItemModel} from '../shared/item-model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent implements OnInit {
  @Input() categories;
  public defaultPic: string;
  @Input() cucc: ItemModel;
  @Input() currentUserId: string;

  constructor() { }

  ngOnInit() {
    this.defaultPic = this.categories.filter(cat => cat.category === this.cucc.category)[0].picUrl;
  }

}

