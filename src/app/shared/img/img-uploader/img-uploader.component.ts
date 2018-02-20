import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {ImageService} from '../../image.service';

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

  constructor(private _imageService: ImageService) { }

  ngOnInit() {
  }

  onFileChange(event) {
    this.images = [];
    if (event.srcElement.files.length > 0) {
      console.log(event.srcElement.files);
      this.files = event.srcElement.files;
      Object.values(this.files).map((file, index) => {
        this._imageService.getOrientation(file)
          .take(1)
          .subscribe(orientation => {
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
      this.formValue.emit({images: this.files});
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






  // clearFile(singleImage) {
  //   let newList;
  //   this.images = this.images.filter((image, imgIndex) => {
  //     if (!(image === singleImage)) {
  //       return true;
  //     } else {
  //       newList = Object.values(this.files)
  //         .filter((file, fileIndex) => !(imgIndex === fileIndex));
  //       this.formValue.emit({
  //         images: newList
  //           .reduce((acc, curr, ind) => Object.assign(acc, {[ind]: curr}), {})
  //       });
  //       return false;
  //     }
  //   });
  //   this.fileInput.nativeElement.value = newList;
  // }

}
