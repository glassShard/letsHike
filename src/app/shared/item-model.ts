import {UserModel} from './user-model';

export class ItemModel {
  id?: string;
  title: string;
  price: number;
  shortDescription: string;
  description: string;
  picUrl: string;
  category: string;
  creatorId: string;
  creator?: UserModel;
  seen: number;
  dateOfPublish: number;

  constructor(param?: ItemModel) {
    if (param) {
      Object.assign(this, param);
    }
  }

  static get emptyItem(): ItemModel {
    return {
      id: '',
      title: '',
      price: 0,
      shortDescription: '',
      description: '',
      picUrl: '',
      category: '',
      creatorId: '',
      seen: 0,
      dateOfPublish: 1516549965
    };
  }
}

