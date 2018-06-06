import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {FileModel} from './file-model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class FileService {
  private _root: string;
  private _avatarUrl: string;
  private _imagesUrl: string;
  private _deleteUrl: string;
  private _setCoverUrl: string;
  public progress: Subject<number>;

  constructor(private _http: HttpClient,
              private _afDb: AngularFireDatabase) {

    this._root = environment.links.root;
    this._avatarUrl = `${this._root}avatar.php`;
    this._imagesUrl = `${this._root}uploadImages.php`;
    this._deleteUrl = `${this._root}deleteImage.php`;
    this._setCoverUrl = `${this._root}setCoverImage.php`;
  }

  uploadAvatar(id: string, form: FormData) {
    return this._http.post<FileModel>(this._avatarUrl, form)
      .switchMap(response => {
        if (response.url) {
          return Observable.fromPromise(this._afDb.object(`users/${id}`).update({'picUrl': response.url}));
        } else {
          return Observable.throw(new Error(response.error));
        }
      });
  }

  startStatus() {
    this.progress = new Subject<number>();
  }

  uploadImages(id: string, form: FormData, whereTo: string, oldImages: string) {
      const req = new HttpRequest('POST', this._imagesUrl, form, {
      reportProgress: true
    });

    return this._http.request(req)
      .skip(1)
      .map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          this.progress.next(percentDone);
        }
        return event;
      })
      .filter(event => event.type === HttpEventType.Response)
      .switchMap(event => {
        if (event instanceof HttpResponse) {
          this.progress.complete();
          const payload: {picUrl?: string, images: string} = {'images': ''};
          if (event.body['url']) {
            if (event.body['coverImg']) {
              payload.picUrl = event.body['coverImg'];
            }
            payload.images = oldImages ? `${oldImages},${event.body['url'].join()}` : event.body['url'].join();
            return Observable.fromPromise(this._afDb.object(`/${whereTo}/${id}`).update(payload));
          } else {
            return Observable.throw(new Error(event.body['error']));
          }
        } else {
          return Observable.of(null);
        }
    });

    // return this._http.post<FileModel>(this._imagesUrl, form)
    //   .flatMap(response => {
    //     const payload: {picUrl?: string, images: string} = {'images': ''};
    //     if (response.url) {
    //       if (response.coverImg) {
    //         payload.picUrl = response.coverImg;
    //       }
    //       payload.images = oldImages ? `${oldImages},${response.url.join()}` : response.url.join();
    //       return Observable.fromPromise(this._afDb.object(`/${whereTo}/${id}`).update(payload));
    //     } else {
    //       return Observable.throw(new Error(response.error));
    //     }
    //   });
  }

  deleteImage(id: string, whereTo: string, imgUrl: string, urls: string) {
    const input = new FormData();
    input.append('url', imgUrl);
    return Observable.fromPromise(this._afDb.object(`/${whereTo}/${id}`).update({'images': urls}))
      .flatMap(() => this._http.post(this._deleteUrl, input));
  }

  setCoverImage(id: string, whereTo: string, imgUrl: string) {
    const input = new FormData();
    input.append('url', imgUrl);
    input.append('whereTo', whereTo);
    input.append('id', id);
    return this._http.post<FileModel>(this._setCoverUrl, input)
      .flatMap(response => {
        if (response.coverImg) {
          return Observable.fromPromise(this._afDb.object(`/${whereTo}/${id}`).update({'picUrl': response.coverImg}));
        } else {
          return Observable.throw(new Error(response.error));
        }
      });
  }

  public upload(files: Set<File>): {[key: string]: Observable<number>} {
    const status = {};

    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST', this._imagesUrl, formData, {
        reportProgress: true
      });

      const progress = new Subject<number>();

      this._http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          const percentDone = Math.round(100 * event.loaded / event.total);

          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    return status;
  }
}
