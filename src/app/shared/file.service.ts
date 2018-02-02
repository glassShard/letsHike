import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileModel} from './file-model';
import 'rxjs/add/operator/mergeMap';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FileService {
  private _avatarUrl = 'http://localhost/turazzunk/avatar.php';

  constructor(private _http: HttpClient) { }

  uploadAvatar(id: string, form: FormData) {
    return this._http.post<FileModel>(this._avatarUrl, form)
      .flatMap(response => {
        if (response.url) {
          return this._http.patch(`${environment.firebase.baseUrl}/users/${id}.json`, {'picUrl': response.url});
        } else {
          return Observable.of(response.error);
        }
      });
  }
}
