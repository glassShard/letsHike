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
  guestsIds?: number[];
  guests?: UserModel[];
  dateOfPublish: number;

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
      date: 0,
      description: '',
      picUrl: '',
      category: '',
      creatorId: '',
      dateOfPublish: 0
    };
  }
}

