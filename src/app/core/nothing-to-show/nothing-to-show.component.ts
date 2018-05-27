import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-nothing-to-show',
  templateUrl: './nothing-to-show.component.html',
  styleUrls: ['./nothing-to-show.component.css']
})
export class NothingToShowComponent {
  @Input() message: string;

  constructor() { }
}
