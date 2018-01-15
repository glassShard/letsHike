import {UserModel} from './user-model';

export class EventModel {
  id?: number;
  title: string;
  days: number;
  country: string;
  region: string;
  date: string;
  description: string;
  picUrl: string;
  category: string;
  creatorId: number;
  creator?: UserModel;
  guestsIds?: number[];
  guests?: UserModel[];

  constructor(param?: EventModel) {
    if (param) {
      Object.assign(this, param);
    }
  }

  static get emptyEvent(): EventModel {
    return {
      title: '',
      days: 0,
      country: '',
      region: '',
      date: '',
      description: '',
      picUrl: '',
      category: '',
      creatorId: 0,
    };
  }
}
