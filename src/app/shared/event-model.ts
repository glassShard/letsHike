import {UserModel} from './user-model';

export class EventModel {
  id?: string;
  title: string;
  days: number;
  country: string;
  region: string;
  date: number;
  description: string;
  picUrl: string;
  category: string;
  creatorId: string;
  creator?: UserModel;
  guestsIds: string[];
  guests?: UserModel[];
  dateOfPublish: number;
  seen: number;

  constructor(param?: EventModel) {
    Object.assign(this, param);
  }

  // static get emptyEvent(): EventModel {
  //   return {
  //     title: '',
  //     days: null,
  //     country: '',
  //     region: '',
  //     date: null,
  //     description: '',
  //     picUrl: '',
  //     category: '',
  //     creatorId: '',
  //     dateOfPublish: 0,
  //     guestsIds: []
  //   };
  // }
}

