export class ChatListModel {
  $id: string;
  nick: string;
  picUrl: string;
  newMessage?: boolean;
  windowOpen?: number;
  created?: number;

  constructor (data?: ChatListModel) {
    if (data != null) {
      Object.assign(this, data);

      const $idPropertyDescriptor = Object.getOwnPropertyDescriptor(this, '$id');
      $idPropertyDescriptor.enumerable = false;
      Object.defineProperty(this, '$id', $idPropertyDescriptor);
    }
  }
}
