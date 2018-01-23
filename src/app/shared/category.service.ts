import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {
  private _itemCategories: {category: string, picUrl: string}[];
  private _eventCategories: {category: string, picUrl: string}[];

  constructor() {
    this._itemCategories = [
      {
        category: 'Mászófelszerelés',
        picUrl: '../assets/vector/friendcb.svg'
      },
      {
        category: 'Védőfelszerelés',
        picUrl: '../assets/vector/helmetcb.svg'
      },
      {
        category: 'Műszer',
        picUrl: '../assets/vector/gpscb.svg'
      },
      {
        category: 'Térkép, könyv',
        picUrl: '../assets/vector/mapcb.svg'
      },
      {
        category: 'Lábbeli',
        picUrl: '../assets/vector/bootcb.svg'
      },
      {
        category: 'Étkezés',
        picUrl: '../assets/vector/knifecb.svg'
      },
      {
        category: 'Táborozás',
        picUrl: '../assets/vector/tentcb.svg'
      },
      {
        category: 'Hátizsák, táska',
        picUrl: '../assets/vector/backpackcb.svg'
      },
      {
        category: 'Téli felszerelés',
        picUrl: '../assets/vector/axecb.svg'
      },
      {
        category: 'Ruházat',
        picUrl: '../assets/vector/jacketcb.svg'
      }
    ];
    this._eventCategories = [
      {
        category: 'Magashegyi túra',
        picUrl: '../assets/vector/axecb.svg'
      },
      {
        category: 'Via Ferrata',
        picUrl: '../assets/vector/caracb.svg'
      },
      {
        category: 'Gyalogtúra',
        picUrl: '../assets/vector/bootcb.svg'
      },
      {
        category: 'Sítúra',
        picUrl: '../assets/vector/axecb.svg'
      },
      {
        category: 'Kerékpártúra',
        picUrl: '../assets/vector/mapcb.svg'
      },
      {
        category: 'Hótalpas túra',
        picUrl: '../assets/vector/axecb.svg'
      }
    ];
  }

  public getItemCategories() {
    return this._itemCategories;
  }

  public getEventCategories() {
    return this._eventCategories;
  }

}
