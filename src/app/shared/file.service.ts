import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileModel} from './file-model';
import 'rxjs/add/operator/mergeMap';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FileService {
  private _root = 'http://localhost/turazzunk';
  private _avatarUrl = `${this._root}/avatar.php`;
  private _imagesUrl = 'http://localhost/turazzunk/uploadImages.php';
  private _deleteUrl = `${this._root}/deleteImage.php`;
  private _setCoverUrl = `${this._root}/setCoverImage.php`;

  constructor(private _http: HttpClient) { }

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
        console.log(response);
        const payload: {picUrl?: string, images: string} = {'images': ''};
        if (response.url) {
          if (response.coverImg) {
            payload.picUrl = response.coverImg;
          }
          const urls = oldImages ? `${oldImages},${response.url.join()}` : response.url.join();
          console.log(urls);
          payload.images = urls;
          return this._http.patch(`${environment.firebase.baseUrl}/${whereTo}/${id}.json`, payload);
        } else {
          return Observable.of({'error': response.error});
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
        console.log(response);
        if (response.coverImg) {
          return this._http.patch(`${environment.firebase.baseUrl}/${whereTo}/${id}.json`, {'picUrl': response.coverImg});
        } else {
          return Observable.of({'error': response.error});
        }
      });
  }
}
