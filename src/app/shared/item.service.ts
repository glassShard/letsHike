import { Injectable } from '@angular/core';
import {ItemModel} from './item-model';
import {UserService} from './user.service';


@Injectable()
export class ItemService {
  private _items: ItemModel[];

  constructor(private _userService: UserService) {
    this._items = [
      {
        id: 1,
        title: 'Hágóvas M10',
        price: 40000,
        shortDescription: 'Hágóvas csupaszon, reszelés után használható',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/axecb.svg',
        category: 'Téli felszerelés',
        creatorId: 1,
        seen: 10
      },
      {
        id: 2,
        title: 'Mászócipő Singing Rock',
        price: 40000,
        shortDescription: 'Széttaposott mászócipő, relikviának, dísznek eladó',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/bootcb.svg',
        category: 'Mászófelszerelés',
        creatorId: 2,
        seen: 1
      },
      {
        id: 3,
        title: 'Sátor Hannah',
        price: 40000,
        shortDescription: 'Szuperkönnyű, 2,2 kg-os kétszemélyes sátor',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/knifecb.svg',
        category: 'Táborozás',
        creatorId: 3,
        seen: 20
      },
      {
        id: 4,
        title: 'Túracipő Han Wag',
        price: 40000,
        shortDescription: '2-szer használt 42-es Yukon, nekem kicsi',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/bootcb.svg',
        category: 'Lábbeli',
        creatorId: 2,
        seen: 5
      },
      {
        id: 5,
        title: 'Matterhorn térkép',
        price: 40000,
        shortDescription: '25 ezres túratérkép, Matterhorn + Észak',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/mapcb.svg',
        category: 'Térkép, könyv',
        creatorId: 3,
        seen: 5
      },
      {
        id: 6,
        title: 'Hágóvas M10',
        price: 40000,
        shortDescription: 'Hágóvas csupaszon, reszelés után használható',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/axecb.svg',
        category: 'Téli felszerelés',
        creatorId: 1,
        seen: 10
      },
      {
        id: 7,
        title: 'Mászócipő Singing Rock',
        price: 40000,
        shortDescription: 'Széttaposott mászócipő, relikviának, dísznek eladó',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/bootcb.svg',
        category: 'Mászófelszerelés',
        creatorId: 2,
        seen: 1
      },
      {
        id: 8,
        title: 'Sátor Hannah',
        price: 40000,
        shortDescription: 'Szuperkönnyű, 2,2 kg-os kétszemélyes sátor',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/knifecb.svg',
        category: 'Táborozás',
        creatorId: 3,
        seen: 20
      },
      {
        id: 9,
        title: 'Túracipő Han Wag',
        price: 40000,
        shortDescription: '2-szer használt 42-es Yukon, nekem kicsi',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/bootcb.svg',
        category: 'Lábbeli',
        creatorId: 2,
        seen: 5
      },
      {
        id: 10,
        title: 'Matterhorn térkép',
        price: 40000,
        shortDescription: '25 ezres túratérkép, Matterhorn + Észak',
        description: 'Lorem ipsum és blablabla...',
        picUrl: '../assets/vector/mapcb.svg',
        category: 'Térkép, könyv',
        creatorId: 3,
        seen: 5
      }
    ];
  }

  getAllItems() {
    return this._items.map(it => {
      return {
        ...it,
        creator: this._userService.getUserById(it.creatorId),
      };
    });
  }

  getItemById(id: number) {
    const item = this._items.filter(it => it.id === id);
    return item.length > 0 ? item[0] : new ItemModel(ItemModel.emptyItem);
  }

  update(it: ItemModel) {
    this._items.map(item => {
      if (item.id === it.id) {
        return {
          ...it
        };
      } else {
        return item;
      }
    });
  }

  create(item: ItemModel) {
    this._items.push({
      id: this._getMaxId() + 1,
      ...item
    });
  }

  private _getMaxId(): number {
    return this._items.reduce((x, y) => x.id > y.id ? x : y).id;
  }

}
