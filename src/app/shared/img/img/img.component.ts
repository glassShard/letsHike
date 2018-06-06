import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FileService} from '../../file.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import {ImgUploaderComponent} from '../img-uploader/img-uploader.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.css']
})
export class ImgComponent implements OnInit {
  @ViewChild(ImgUploaderComponent) private _imgUploaderComponent: ImgUploaderComponent;
  @Input() whereTo: string;
  @Input() id: string;
  @Input() uploadedImages: any[] = [];
  @Input() oldCoverImg: string;
  @Input() imagesString: string;
  @Output() formValue = new EventEmitter();
  @Output() alert = new EventEmitter();
  private _stream: Observable<object>;
  private _imagesToUpload: FileList;
  private _markedImgIndex = -1;
  private _coverImg = '';
  private _picUrl = '';
  public coverFromSaved = true; // borítókép kiválasztásához toggle
  public errorTooBigPost = 'A feltölteni kívánt fájlok maximális mérete 32MB' +
    ' lehet. A te képeid összesített mérete ezt meghaladja. Kérjük,' +
    ' tartsd be a limitet.';
  public errorCoverImg = 'Hiba a borítókép beállításánál. Kérjük,' +
    ' próbáld újra';
  private _root = environment.links.root;
  public progress: number;

  constructor(private _fileService: FileService) { }

  ngOnInit() {
    if (!this.oldCoverImg) {
      this._markedImgIndex = 0;
    } else {
      this._picUrl = this.oldCoverImg;
    }
  }

  filesChange(images) {
    this._imagesToUpload = images;
    this.formValue.emit({images: images});
    console.log('img comp images: ', images);
  }

  saveImages(id) {
    console.log(id);
    if (this._imagesToUpload) {
      this._fileService.startStatus();
      this.progress = 0;
      this._fileService.progress.subscribe(progress => {
        this.progress = progress;
      });

      const formModel = this.prepareSave(id);
      if (Object.values(this._imagesToUpload)
          .map((curr) => curr['size'])
          .reduce((acc, curr) => acc + curr) > 32000000) {
        this.doIfFailed(this.errorTooBigPost);
      } else {
        if (this._coverImg && this.oldCoverImg !== `cover_${this._coverImg}`) {
          this._stream = (this._fileService.setCoverImage(
            id,
            this.whereTo,
            this._coverImg.replace(this._root, ''))
            .flatMap(() => {
              return this._fileService.uploadImages(
                id,
                formModel,
                this.whereTo,
                this.imagesString
              );
            }));
        } else {
          this._stream = this._fileService.uploadImages(
            id,
            formModel,
            this.whereTo,
            this.imagesString
          );
        }
      }
    } else {
      if (this._coverImg && this.oldCoverImg !== `cover_${this._coverImg}`) {
        this._stream = this._fileService.setCoverImage(
          id,
          this.whereTo,
          this._coverImg.replace(this._root, ''));
      }
    }
    if (this._stream) {
      this._stream.subscribe(() => {
        this.progress = null;
        this.doIfSuccess();
      }, error => {
        console.warn(error);
        this.progress = null;
        this.doIfFailed('Hiba az adatok mentésekor. Kérjük, próbáld újra.');
      });
    }
  }

  private prepareSave(id): FormData {
    const input = new FormData();
    input.append('id', id);
    input.append('whereTo', this.whereTo);
    input.append('markedImageIndex', this._markedImgIndex.toString());
    console.log(this._markedImgIndex);
    Object.values(this._imagesToUpload).map(image => {
      input.append('imagesToUpload[]', image);
    });
    return input;
  }

  setIndex(imgIndex) {
    this._coverImg = '';
    this.coverFromSaved = false;
    this._markedImgIndex = imgIndex;
  }

  setCoverImage(imgUrl) {
    this._markedImgIndex = -1;
    this.coverFromSaved = true;
    this._coverImg = imgUrl;
    console.log(imgUrl);
  }

  doIfSuccess() {
    this.alert.emit({type: 'success', value: 'Az adatokat mentettük.'});
    this.clearFileFromForm();
  }

  doIfFailed(error) {
    this.alert.emit({type: 'error', value: error});
  }

  clearFileFromForm() {
    this._imagesToUpload = null;
    this._imgUploaderComponent.clearForm();
  }

  deleteImage(imgUrl) {
    const index = this.uploadedImages.indexOf(imgUrl);
    if (index > -1) {
      this.uploadedImages.splice(index, 1);
    }
    this.imagesString = this.uploadedImages
      .map(img => img.replace(this._root, ''))
      .join();
    const urlToDelete = imgUrl.replace(this._root, '');
    this._fileService.deleteImage(this.id, this.whereTo, urlToDelete, this.imagesString)
      .subscribe();
  }
}
