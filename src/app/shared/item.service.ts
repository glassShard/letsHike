import { Injectable } from '@angular/core';
import {ItemModel} from './item-model';
import {UserService} from './user.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {EventModel} from './event-model';
import {HttpClient} from '@angular/common/http';
import {UserModel} from './user-model';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import {FirebaseRegistrationModel} from './firebase-registration-model';


@Injectable()
export class ItemService {
  private _items: ItemModel[];

  constructor(private _userService: UserService,
              private _http: HttpClient) {
    // this._items = [
    //   {
    //     id: 1,
    //     title: 'Hágóvas M10',
    //     price: 40000,
    //     shortDescription: 'Hágóvas csupaszon, reszelés után használható',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/axecb.svg',
    //     category: 'Téli felszerelés',
    //     creatorId: '',
    //     seen: 10
    //   },
    //   {
    //     id: 2,
    //     title: 'Mászócipő Singing Rock',
    //     price: 40000,
    //     shortDescription: 'Széttaposott mászócipő, relikviának, dísznek eladó',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/bootcb.svg',
    //     category: 'Mászófelszerelés',
    //     creatorId: '',
    //     seen: 1
    //   },
    //   {
    //     id: 3,
    //     title: 'Sátor Hannah',
    //     price: 40000,
    //     shortDescription: 'Szuperkönnyű, 2,2 kg-os kétszemélyes sátor',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/knifecb.svg',
    //     category: 'Táborozás',
    //     creatorId: '',
    //     seen: 20
    //   },
    //   {
    //     id: 4,
    //     title: 'Túracipő Han Wag',
    //     price: 40000,
    //     shortDescription: '2-szer használt 42-es Yukon, nekem kicsi',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/bootcb.svg',
    //     category: 'Lábbeli',
    //     creatorId: '',
    //     seen: 5
    //   },
    //   {
    //     id: 5,
    //     title: 'Matterhorn térkép',
    //     price: 40000,
    //     shortDescription: '25 ezres túratérkép, Matterhorn + Észak',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/mapcb.svg',
    //     category: 'Térkép, könyv',
    //     creatorId: '',
    //     seen: 5
    //   },
    //   {
    //     id: 6,
    //     title: 'Hágóvas M10',
    //     price: 40000,
    //     shortDescription: 'Hágóvas csupaszon, reszelés után használható',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/axecb.svg',
    //     category: 'Téli felszerelés',
    //     creatorId: '',
    //     seen: 10
    //   },
    //   {
    //     id: 7,
    //     title: 'Mászócipő Singing Rock',
    //     price: 40000,
    //     shortDescription: 'Széttaposott mászócipő, relikviának, dísznek eladó',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/bootcb.svg',
    //     category: 'Mászófelszerelés',
    //     creatorId: '',
    //     seen: 1
    //   },
    //   {
    //     id: 8,
    //     title: 'Sátor Hannah',
    //     price: 40000,
    //     shortDescription: 'Szuperkönnyű, 2,2 kg-os kétszemélyes sátor',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/knifecb.svg',
    //     category: 'Táborozás',
    //     creatorId: '',
    //     seen: 20
    //   },
    //   {
    //     id: 9,
    //     title: 'Túracipő Han Wag',
    //     price: 40000,
    //     shortDescription: '2-szer használt 42-es Yukon, nekem kicsi',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/bootcb.svg',
    //     category: 'Lábbeli',
    //     creatorId: '',
    //     seen: 5
    //   },
    //   {
    //     id: 10,
    //     title: 'Matterhorn térkép',
    //     price: 40000,
    //     shortDescription: '25 ezres túratérkép, Matterhorn + Észak',
    //     description: 'Lorem ipsum és blablabla...',
    //     picUrl: '../assets/vector/mapcb.svg',
    //     category: 'Térkép, könyv',
    //     creatorId: '',
    //     seen: 5
    //   }
    // ];
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

  getItemById(id: string) {
    return this._http
      .get<ItemModel>(`${environment.firebase.baseUrl}/items/${id}.json`);
  }

  save(param: ItemModel) {
    this._userService.getCurrentUser().subscribe(currentUser => {
      param.creatorId = currentUser.id;
      delete param.creator;
      if (param.id) { // udpate ag
        this._http.put(`${environment.firebase.baseUrl}/items/${param.id}.json`, param).subscribe();
      } else { // create ag
        this._http.post(`${environment.firebase.baseUrl}/items.json`, param)
          .map((fbPostReturn: { name: string }) => fbPostReturn.name)
          .switchMap(fbId => this._http.patch(
            `${environment.firebase.baseUrl}/events/${fbId}.json`,
            {id: fbId}
          )).subscribe(data => data, error => console.log(error));
      }
    });
  }

  // update(it: ItemModel); {
    // this._items.map(item => {
    //   if (item.id === it.id) {
    //     return {
    //       ...it
    //     };
    //   } else {
    //     return item;
    //   }
    // });
  // }

  // create(item: ItemModel); {
  //   this._items.push({
  //     id: this._getMaxId() + 1,
  //     ...item
  //   });
  // }

}
