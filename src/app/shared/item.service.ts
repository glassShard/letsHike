import {Injectable} from '@angular/core';
import {ItemModel} from './item-model';
import {UserService} from './user.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {UserModel} from './user-model';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';


@Injectable()
export class ItemService {

  constructor(private _userService: UserService,
              private _http: HttpClient) {
  }

  getAllItems(): Observable<ItemModel[]> {
    return this._http.get(`${environment.firebase.baseUrl}/items.json`)
      .map(data => Object.values(data))
      .map(itm => itm.map(im =>
        Observable.zip(
          Observable.of(im),
          this._userService.getUserById(im.creatorId),
          (i: ItemModel, u: UserModel) => {
            return {
              ...i,
              creator: u
            };
          }
        )))
      .switchMap(zipStreamArray => Observable.forkJoin(zipStreamArray));
  }

  getItemById(id: string): Observable<ItemModel> {
    return this._http
      .get<ItemModel>(`${environment.firebase.baseUrl}/items/${id}.json`)
      .flatMap(
        item => Observable.combineLatest(
          Observable.of(new ItemModel(item)),
          this._userService.getUserById(item.creatorId),
          (i: ItemModel, u: UserModel) => {
            return {
              ...i,
              creator: u
            };
          }
        )
      );
  }

  save(item: ItemModel) {
    item.creatorId = this._userService.currentUserId;
    delete item.creator;
    if (item.id) { // udpate ag
      return this._http.put(`${environment.firebase.baseUrl}/items/${item.id}.json`, item);
    } else { // create ag
      Object.assign(item, {dateOfPublish: Math.floor(Date.now() / 1000)});
      return this._http.post(`${environment.firebase.baseUrl}/items.json`, item)
        .map((fbPostReturn: { name: string }) => fbPostReturn.name)
        .do(fbid => console.log(fbid))
        .switchMap(fbId => this._http.patch(
          `${environment.firebase.baseUrl}/items/${fbId}.json`,
          {id: fbId}
        ));
    }
  }

  delete(itemId: string) {
    return this._http.delete(`${environment.firebase.baseUrl}/items/${itemId}.json`);
  }
}
