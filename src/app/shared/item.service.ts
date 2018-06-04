import {Injectable} from '@angular/core';
import {ItemModel} from './item-model';
import {UserService} from './user.service';
import {Observable} from 'rxjs/Observable';
import {UserModel} from './user-model';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class ItemService {

  constructor(private _userService: UserService,
               private _afDb: AngularFireDatabase) {
  }

  getAllItems(): Observable<ItemModel[]> {
    return this._afDb.list(`items`)
  //    .map(items => items.map(item => new ItemModel(item)))
  //    .map(data => Object.values(data))
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
    return this._afDb.object(`items/${id}`)
      .flatMap(item => {
        if (item.$exists()) {
          return Observable.combineLatest(
            Observable.of(new ItemModel(item)),
            this._userService.getUserById(item.creatorId),
            (i: ItemModel, u: UserModel) => {
              return {
                ...i,
                creator: u
              };
            }
          );
        } else {
          return Observable.of(null);
        }
      });
  }

  save(item: ItemModel) {
    item.creatorId = this._userService.currentUserId;
    delete item.creator;
    if (item.id) { // udpate ag
      return Observable.fromPromise(this._afDb.object(`/items/${item.id}`).update(item))
        .flatMap(() => Observable.of(item));
    } else { // create ag
      Object.assign(item, {dateOfPublish: Math.floor(Date.now() / 1000)});
      return Observable.fromPromise(this._afDb.list('items').push(item))
        .map(res => res.key)
        .do(key => this._afDb.object(`items/${key}`).update({id: key}))
        .flatMap((key) => this._afDb.object(`items/${key}`));
     }
  }

  delete(itemId: string) {
    return Observable.fromPromise(this._afDb.object(`/items/${itemId}`).set(null));
  }
}
