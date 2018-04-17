import {ChatListModel} from './chat-list.model';

export class ChatCallModel {
  $id: string;
  roomId: string;
  friend: ChatListModel;

  constructor (data?: ChatCallModel) {
    if (data != null) {
      Object.assign(this, data);

      const $idPropertyDescriptor = Object.getOwnPropertyDescriptor(this, '$id');
      $idPropertyDescriptor.enumerable = false;
      Object.defineProperty(this, '$id', $idPropertyDescriptor);
    }
  }
}
