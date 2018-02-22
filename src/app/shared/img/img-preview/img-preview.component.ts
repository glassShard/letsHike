import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.css']
})
export class ImgPreviewComponent implements OnInit {
  public marked: any = null;
  @Input() coverFromSaved: boolean;
  @Input() uploadedImages: any[] = [];
  @Input() oldCoverImg: string;
  @Output() deleteImage = new EventEmitter();
  @Output() coverImg = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.marked = this.oldCoverImg.replace('cover_', '');
  }

  onDeleteImage(imgUrl) {
    this.deleteImage.emit({imgUrl: imgUrl});
  }

  markAsCover(imgUrl) {
    this.marked = null;
    this.coverImg.emit({coverImg: imgUrl});
    this.marked = imgUrl;
    console.log(imgUrl);
  }
}
