import {UserModel} from './user-model';

export class ItemModel {
  id: string;
  title: string;
  price: number;
  shortDescription: string;
  description: string;
  picUrl: string;
  images: string[];
  category: string;
  creatorId: string;
  creator: UserModel;
  seen: number;
  dateOfPublish: number;

  constructor(param?: ItemModel) {
    Object.assign(this, param);
  }

  // setCreator(creator: UserModel) {
  //   delete this.creator;
  //   this.creator = creator;
  //   const creatorPropertyDescriptor = Object.getOwnPropertyDescriptor(this, 'creator');
  //   creatorPropertyDescriptor.enumerable = false;
  //   Object.defineProperty(this, 'creator', creatorPropertyDescriptor);
  //   return this;
  // }
}

