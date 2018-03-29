import { Injectable } from '@angular/core';
import {UserService} from '../shared/user.service';
import {Observable} from 'rxjs/Observable';
import {ChatMessageModel} from './model/chat.model';
import * as moment from 'moment';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ChatService {
  private static PATH = 'chat/room';

  constructor(private _userService: UserService,
              private _afDb: AngularFireDatabase) {
  }

  addMessage(roomId: string, msg: string): Observable<boolean> {
    return this._userService.getCurrentUser()
      .switchMap(user => {
        if (user) {
          return new Observable<boolean>(
            observer => {
              const room = this._afDb.list(`${ChatService.PATH}/${roomId}`);
              const picUrl = user.picUrl ? user.picUrl : '';
              room.push(
                new ChatMessageModel({
                  $id: null,
                  'msg': msg,
                  userId: user.id,
                  userName: user.nick,
                  userPicUrl: picUrl,
                  created: moment().unix()
                })
              ).then(() => {
                observer.next(true);
                observer.complete();
              }, error => {
                observer.next(false);
                observer.error(error);
                observer.complete();
              });
            }
          );
        }
      });
  }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    return this._afDb.list(`${ChatService.PATH}/${roomId}`)
      .map(list => {
        console.log(list);
        return list.map(chatMessage => new ChatMessageModel(Object.assign(chatMessage, {$id: chatMessage.key})));
      });
  }
}
