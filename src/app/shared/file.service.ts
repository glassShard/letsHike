import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileModel} from './file-model';
import 'rxjs/add/operator/mergeMap';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FileService {
  private _avatarUrl = 'http://localhost/turazzunk/avatar.php';
  private _imagesUrl = 'http://localhost/turazzunk/uploadImages.php';

  constructor(private _http: HttpClient) { }

  uploadAvatar(id: string, form: FormData) {
    return this._http.post<FileModel>(this._avatarUrl, form)
      .flatMap(response => {
        if (response.url) {
          console.log(response.url);
          return this._http.patch(`${environment.firebase.baseUrl}/users/${id}.json`, {'picUrl': response.url[0]});
        } else {
          return Observable.of(response.error);
        }
      });
  }

  uploadImages(id: string, form: FormData, whereTo: string) {
    return this._http.post<FileModel>(this._imagesUrl, form)
      .flatMap(response => {
        console.log(response);
        if (response.url) {
          const urls = response.url.join();
          console.log(urls);
          return this._http.put(`${environment.firebase.baseUrl}/${whereTo}/${id}.json`, {'images': urls});
        } else {
          return Observable.of(response.error);
        }
      });
  }
}
