import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileModel} from './file-model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class FileService {
  private _root: string;
  private _avatarUrl: string;
  private _imagesUrl: string;
  private _deleteUrl: string;
  private _setCoverUrl: string;

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
          console.log(response.url);
          return Observable.fromPromise(this._afDb.object(`users/${id}`).update({'picUrl': response.url}));
        } else {
          return Observable.throw(new Error(response.error));
        }
      });
  }

  uploadImages(id: string, form: FormData, whereTo: string, oldImages: string) {
    return this._http.post<FileModel>(this._imagesUrl, form)
      .flatMap(response => {
        const payload: {picUrl?: string, images: string} = {'images': ''};
        if (response.url) {
          if (response.coverImg) {
            payload.picUrl = response.coverImg;
          }
          payload.images = oldImages ? `${oldImages},${response.url.join()}` : response.url.join();
          return Observable.fromPromise(this._afDb.object(`/${whereTo}/${id}`).update(payload));
        } else {
          return Observable.throw(new Error(response.error));
        }
      });
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
}
