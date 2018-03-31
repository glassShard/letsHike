import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EmailService {

  constructor(private _http: HttpClient) { }

  sendMail(form: FormData): Observable<any> {
    return this._http.post('http://turazzunk.hu/sendMail.php', form);
  }
}
