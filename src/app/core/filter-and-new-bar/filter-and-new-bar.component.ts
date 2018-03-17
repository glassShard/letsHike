import {
  Component, EventEmitter, Input, OnInit,
  Output, Renderer2
} from '@angular/core';

@Component({
  selector: 'app-filter-and-new-bar',
  templateUrl: './filter-and-new-bar.component.html',
  styleUrls: ['./filter-and-new-bar.component.css']
})
export class FilterAndNewBarComponent implements OnInit {
  @Input() categories: string[];
  @Input() title: string;
  @Input() newButton: string;
  @Output() choosenCategory = new EventEmitter();
  @Output() searchField = new EventEmitter();
  private categoryButtonLabel = 'Kategóriák';
  public choosenCat = '';

  isCollapsed = true;


  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  onCategoryClick(category) {
    this.choosenCategory.emit({category: category});
    this.choosenCat = category;
  }

  onKeyup($event) {
    this.searchField.emit({text: $event.srcElement.value});
  }

  categoryButtonClick() {
    if (!this.isCollapsed) {
      this.choosenCategory.emit({category: null});
      this.choosenCat = '';
    }
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.categoryButtonLabel = 'Kategóriák';
    } else {
      this.categoryButtonLabel = 'Mind';
    }
  }

  setHeight(el, height) {
    this.renderer.setStyle(el, 'height', height + 'px');
  }
}
