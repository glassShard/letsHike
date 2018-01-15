import {UserModel} from './user-model';

export class ItemModel {
  id: number;
  title: string;
  price: number;
  shortDescription: string;
  description: string;
  picUrl: string;
  category: string;
  creatorId: number;
  creator?: UserModel;
  seen: number;

  constructor(param?: ItemModel) {
    if (param) {
      Object.assign(this, param);
    }
  }

  static get emptyItem(): ItemModel {
    return {
      id: 0,
      title: '',
      price: 0,
      shortDescription: '',
      description: '',
      picUrl: '',
      category: '',
      creatorId: 0,
      seen: 0,
    };
  }
}

