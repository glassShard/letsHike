import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CategoryService {
  private _itemCategories: {
    category: string,
    picUrl: string,
    users?: string[]
  }[];
  private _eventCategories: {
    category: string,
    picUrl: string,
    users?: string[]
  }[];

  constructor(private _http: HttpClient) {}

  public getItemCategories() {
    return this._http.get(`${environment.firebase.baseUrl}/categories/itemCategories.json`)
      .flatMap(res => {
        this._itemCategories = Object.values(res);
        return Observable.of(this._itemCategories);
      });
  }

  public getEventCategories() {
    return this._http.get(`${environment.firebase.baseUrl}/categories/eventCategories.json`)
      .flatMap(res => {
        this._eventCategories = Object.values(res);
        return Observable.of(this._eventCategories);
      });
  }
}
