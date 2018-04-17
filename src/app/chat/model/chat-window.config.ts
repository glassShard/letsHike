import {ChatListModel} from './chat-list.model';

export interface  ChatWindowConfig {
  id?: string;
  title: string;
  roomId: string;
  closeable?: boolean;
  friend: ChatListModel;
  new?: boolean;
}
