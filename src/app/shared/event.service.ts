import {Injectable} from '@angular/core';
import {EventModel} from './event-model';
import {UserService} from './user.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {UserModel} from './user-model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class EventService {

  constructor(private _userService: UserService,
              private _http: HttpClient,
              private _afDb: AngularFireDatabase) {
  }

  getAllEvents(): Observable<EventModel[]> {
    return this._afDb.list(`events`)
    //    .map(items => items.map(item => new ItemModel(item)))
    //    .map(data => Object.values(data))
      .map(evm => evm.map(em =>
        Observable.zip(
          Observable.of(em),
          this._userService.getUserById(em.creatorId),
          (i: EventModel, u: UserModel) => {
            return {
              ...i,
              creator: u
            };
          }
        )))
      .switchMap(zipStreamArray => Observable.forkJoin(zipStreamArray));
  }

  join(user: string, event: string) {
    return Observable.fromPromise(this._afDb.object(`/events/${event}/guestsIds/${user}`).set(true));
  }

  addSeen(id: string, seen: number) {
    return Observable.fromPromise(this._afDb.object(`/events/${id}/seen`).set(seen));
  }

  getEventByIdOnce(id: string): Observable<EventModel> {
    return this.getEventById(id, 'event-service 49').first();
  }

  getEventById(id: string, honnan: string): Observable<EventModel> {

    return this._afDb.object(`events/${id}`)
      .flatMap(event => {
        console.log('mégegyszer', honnan);
        if (event.$exists()) {
          if (event.guestsIds) {
            event.guestsIds = Object.keys(event.guestsIds);
            return Observable.combineLatest(
              Observable.of(new EventModel(event)),
              this._userService.getUserById(event.creatorId),
              Observable.forkJoin(
                event.guestsIds.map(user => this._userService.getUserById(user).first())
              ),
              (e: EventModel, u: UserModel, g: UserModel[]) => {
                return {
                  ...e,
                  creator: u,
                  guests: g
                };
              }
            );
          } else {
            return Observable.combineLatest(
              Observable.of(new EventModel(event)),
              this._userService.getUserById(event.creatorId),
              (e: EventModel, u: UserModel) => {
                return {
                  ...e,
                  creator: u
                };
              }
            );
          }
        } else {
          return Observable.of(null);
        }
      });
  }

  deleteJoin(user: string, event: string) {
    return Observable.fromPromise(this._afDb.object(`/events/${event}/guestsIds/${user}`).set(null));
  }

  save(param: EventModel) {
    param.creatorId = this._userService.currentUserId;
    delete param.creator;
    delete param.guests;
    if (param.id) { // update ag
      if (param.guestsIds) {
        const convertedGuestsIds = param.guestsIds
          .reduce((acc, guestId) => Object.assign(acc, {[guestId]: true}), {});
        Object.assign(param, {guestsIds: convertedGuestsIds});
      }
      return Observable.fromPromise(this._afDb.object(`/events/${param.id}`).update(param))
        .flatMap(() => Observable.of(param))
        .do(res => console.log(res));
    } else { // create ag
      Object.assign(param, {dateOfPublish: Math.floor(Date.now() / 1000)});
      return Observable.fromPromise(this._afDb.list('events').push(param))
        .map(res => res.key)
        .do(key => this._afDb.object(`events/${key}`).update({id: key}))
        .flatMap((key) => this._afDb.object(`events/${key}`));
    }
  }

  delete(eventId: string) {
    return Observable.fromPromise(this._afDb.object(`/events/${eventId}`).set(null));
  }
}
