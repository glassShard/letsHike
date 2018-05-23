import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileModel} from './file-model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FileService {
  private _root: string;
  private _avatarUrl: string;
  private _imagesUrl: string;
  private _deleteUrl: string;
  private _setCoverUrl: string;

  constructor(private _http: HttpClient) {
    this._root = environment.links.root;
    this._avatarUrl = `${this._root}avatar.php`;
    this._imagesUrl = `${this._root}uploadImages.php`;
    this._deleteUrl = `${this._root}deleteImage.php`;
    this._setCoverUrl = `${this._root}setCoverImage.php`;
  }

  uploadAvatar(id: string, form: FormData) {
    return this._http.post<FileModel>(this._avatarUrl, form)
      .flatMap(response => {
        if (response.url) {
          console.log(response.url);
          return this._http.patch(`${environment.firebase.baseUrl}/users/${id}.json`, {'picUrl': response.url});
        } else {
          return Observable.of(response.error);
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
          return this._http.patch(`${environment.firebase.baseUrl}/${whereTo}/${id}.json`, payload);
        } else {
          return Observable.throw(new Error(response.error));
        }
      });
  }

  deleteImage(id: string, whereTo: string, imgUrl: string, urls: string) {
    const input = new FormData();
    input.append('url', imgUrl);
    return this._http.patch(`${environment.firebase.baseUrl}/${whereTo}/${id}.json`, {'images': urls})
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
          return this._http.patch(`${environment.firebase.baseUrl}/${whereTo}/${id}.json`, {'picUrl': response.coverImg});
        } else {
          return Observable.throw(new Error(response.error));
        }
      });
  }
}
