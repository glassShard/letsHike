import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {ImageService} from '../../image.service';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-img-uploader',
  templateUrl: './img-uploader.component.html',
  styleUrls: ['./img-uploader.component.css']
})
export class ImgUploaderComponent implements OnInit {
  public images: any[] = [];
  private files;
  public marked: any = null;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() formValue = new EventEmitter();
  @Output() index = new EventEmitter();
  @Input() coverFromSaved: boolean;

  constructor(private _imageService: ImageService) { }

  ngOnInit() {
  }

  onFileChange(event) {
    if (event.srcElement.files.length > 0) {
      console.log(event.srcElement.files);
      this.files = event.srcElement.files;
      console.log('img uploader images: ', this.files);
      console.log(Object.values(this.files));
      this.formValue.emit({images: this.files});
      Object.values(this.files).map((file, index) => {
        this._imageService.getOrientation(file)
          .take(1)
          .subscribe(orientation => {
            console.log(file.name, index);
            console.log(orientation); // eddig jó
            const reader = new FileReader();
            reader.readAsDataURL(file);
            if (orientation === 8 || orientation === 3 || orientation === 6) {
              reader.onload = (ev) => {
                this._imageService.resetOrientation(reader.result, orientation)
                  .take(1)
                  .subscribe(newImage => this.images.splice(index, 0, newImage));
              };
            } else {
              reader.onload = (ev) => {
                this.images.splice(index, 0, reader.result);
              };
            }
          });
      });
    }
  }

  markFile(singleImage) {
    this.marked = null;
    this.marked = this.images.filter((image, imgIndex) => {
      if (image === singleImage) {
        this.index.emit({imgIndex: imgIndex});
        return true;
      }
      return false;
    });
  }

  clearForm() {
    this.fileInput.nativeElement.value = '';
    this.images = [];
  }

  addFilesFired() {
    this.clearForm();
    this.fileInput.nativeElement.click();
  }
}
