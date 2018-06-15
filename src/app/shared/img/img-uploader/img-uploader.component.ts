import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {ImageService} from '../../image.service';
import 'rxjs/add/operator/take';
import {Observable} from 'rxjs/Observable';

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
      this.files = event.srcElement.files;
      this.formValue.emit({images: this.files});
      for (let i = 0; i < this.files.length; i++) {
        this.images.push(1);
      }
      Object.values(this.files).map((file, index) => {
        Observable.combineLatest(
          this._imageService.getOrientation(file)
            .take(1),
          new Observable(observer => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              observer.next(reader.result);
              observer.complete();
            };
          }),
          (orientation: number, base64Image: string) => {
            return {
              orientation: orientation,
              base64Image: base64Image
            };
          })
          .switchMap(imgObject => {
            let getImage: Observable<any>;
            if (imgObject.orientation === 8 || imgObject.orientation === 3 || imgObject.orientation === 6) {
              getImage = this._imageService
                .resetOrientation(imgObject.base64Image, imgObject.orientation).take(1);
            } else {
              getImage = Observable.of(imgObject.base64Image);
            }
            return getImage;
          })
          .subscribe(base64Image => {
            this.images.splice(index, 1, base64Image);
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
