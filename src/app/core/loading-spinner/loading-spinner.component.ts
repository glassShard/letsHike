import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() loaderWidth = 120;
  @Input() loaderHeight = 120;
  @Input() border = 5;
  @Input() margin = 50;
}
