import {Injectable} from '@angular/core';
import {EventModel} from './event-model';
import {UserService} from './user.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {UserModel} from './user-model';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import * as firebase from 'firebase';

@Injectable()
export class EventService {

  constructor(private _userService: UserService,
              private _http: HttpClient) {
  }

  getAllEvents(): Observable<EventModel[]> {
    return this._http.get(`${environment.firebase.baseUrl}/events.json`)
      .map(data => Object.values(data))
      .map(evm => evm.map(em =>
        Observable.zip(
          Observable.of(em),
          this._userService.getUserById(em.creatorId),
          (e: EventModel, u: UserModel) => {
            return {
              ...e,
              creator: u
            };
          }
        )))
      .switchMap(zipStreamArray => Observable.forkJoin(zipStreamArray));
  }

  getEventById(id: string): Observable<EventModel> {

    return new Observable(
      observer => {
        const dbEvent = firebase.database().ref(`events/${id}`);
        dbEvent.on('value',
          snapshot => {
          const event = snapshot.val();
          if (event.guestsIds) {
            event.guestsIds = Object.keys(event.guestsIds);
            const subscription = Observable.combineLatest(
              Observable.of(new EventModel(event)),
              this._userService.getUserById(event.creatorId),
              Observable.forkJoin(
                event.guestsIds.map(user => this._userService.getUserById(user))
              ),
              (e: EventModel, u: UserModel, g: UserModel[]) => {
                console.log(e);
                console.log(u);
                console.log(g);
                return {
                  ...e,
                  creator: u,
                  guests: g
                };
              }
            ).subscribe(eventModel => {
              observer.next(eventModel);
              subscription.unsubscribe();
            });
          } else {
            const subscription = Observable.combineLatest(
              Observable.of(new EventModel(event)),
              this._userService.getUserById(event.creatorId),
              (e: EventModel, u: UserModel) => {
                return {
                  ...e,
                  creator: u
                };
              }
            ).subscribe(eventModel => {
              observer.next(eventModel);
              subscription.unsubscribe();
            });
          }
        });
      }
    );


    // return this._http
    //   .get<EventModel>(`${environment.firebase.baseUrl}/events/${id}.json`)
    //   .flatMap(
    //     event => {
    //       if (event.guestsIds) {
    //         event.guestsIds = Object.keys(event.guestsIds);
    //         return Observable.combineLatest(
    //           Observable.of(new EventModel(event)),
    //           this._userService.getUserById(event.creatorId),
    //           Observable.forkJoin(
    //             event.guestsIds.map(user => this._userService.getUserById(user))
    //           ),
    //           (e: EventModel, u: UserModel, g: UserModel[]) => {
    //             return {
    //               ...e,
    //               creator: u,
    //               guests: g
    //             };
    //           }
    //         );
    //       } else {
    //         return Observable.combineLatest(
    //           Observable.of(new EventModel(event)),
    //           this._userService.getUserById(event.creatorId),
    //           (e: EventModel, u: UserModel) => {
    //             return {
    //               ...e,
    //               creator: u
    //             };
    //           }
    //         );
    //       }
    //     }
    //   );
  }

  join(user: string, event: string) {
    return this._http.put(`${environment.firebase.baseUrl}/events/${event}/guestsIds/${user}.json`, true);
  }

  deleteJoin(user: string, event: string) {
    return this._http.delete(`${environment.firebase.baseUrl}/events/${event}/guestsIds/${user}.json`);
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
      return this._http.put(`${environment.firebase.baseUrl}/events/${param.id}.json`, param);
    } else { // create ag
      Object.assign(param, {dateOfPublish: Math.floor(Date.now() / 1000)});
      return this._http.post(`${environment.firebase.baseUrl}/events.json`, param)
        .map((fbPostReturn: { name: string }) => fbPostReturn.name)
        .do(fbid => console.log(fbid))
        .switchMap(fbId => this._http.patch(
          `${environment.firebase.baseUrl}/events/${fbId}.json`,
          {id: fbId}
        ));
    }
  }

  delete(eventId: string) {
    return this._http.delete(`${environment.firebase.baseUrl}/events/${eventId}.json`);
  }

  // update(ev: EventModel) {
  //   this._events = this._events.map(event => event.id === ev.id ? {...ev} : event);
  // }
  //
  // create(ev: EventModel) {
  //   this._events = [
  //     ...this._events,
  //     {
  //       id: this._getMaxId() + 1,
  //       ...ev
  //     }
  //   ];
  // }

// private _getMaxId() {
//   return this._events.reduce((x, y) => x.id > y.id ? x : y).id;
// }
}
