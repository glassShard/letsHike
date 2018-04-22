import {Injectable} from '@angular/core';
import {UserService} from '../shared/user.service';
import {Observable} from 'rxjs/Observable';
import {ChatMessageModel} from './model/chat.model';
import * as moment from 'moment';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import {ChatListModel} from './model/chat-list.model';
import 'rxjs/add/operator/first';
import {ChatCallModel} from './model/chat-call.model';
import 'rxjs/add/operator/merge';

@Injectable()
export class ChatService {
  private static PATH = 'chat';

  constructor(private _userService: UserService,
              private _afDb: AngularFireDatabase) {
  }

  addMessage(roomId: string, msg: string, friend: ChatListModel): Observable<boolean> {
    return this._userService.getCurrentUser()
      .switchMap(user => {
        if (user) {
          let modifyObs;
          if (friend != null) {
            modifyObs = Observable.fromPromise(this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`)
              .update({
                newMessage: true,
                created: moment().unix()
              }));
          } else {
            modifyObs = Observable.of(null);
          }
          return modifyObs.switchMap(() => {
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
          });
        }
      });
  }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    return this._afDb.list(`${ChatService.PATH}/${roomId}`)
      .map(list => {
        return list.map(chatMessage => new ChatMessageModel(Object.assign(chatMessage, {$id: chatMessage.key})));
      });
  }

  addFriend(friend: ChatListModel) {
    return this._userService.getCurrentUser().first()
      .switchMap(user => {
        return Observable.fromPromise(this._afDb.object(`chat_friend_list/${user.id}/${friend.$id}`)
          .set({nick: friend.nick, picUrl: friend.picUrl, newMessage: false}))
          .merge(Observable.fromPromise(this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`)
            .set({nick: user.nick, picUrl: user.picUrl, newMessage: true, created: moment().unix()}))
          );
      });
  }

  getFriendList(): Observable<ChatListModel[]> {
    return this._userService.getCurrentUser()
      .first()
      .switchMap(user => {
        return this._afDb.list(`chat_friend_list/${user.id}`)
          .map(rawFriends => rawFriends.sort((a, b) => {
            const dateA = a.created;
            const dateB = b.created;
            return (dateA > dateB) ? -1 : (dateA < dateB) ? 1 : 0;
          }))
          .map(friends => friends.map(
            friend => new ChatListModel(Object.assign(friend, {$id: friend.$key}))
          ));
      });
  }

  addChatWait(roomId: string, friend: ChatListModel) {
    this._userService.getCurrentUser().first()
      .subscribe(user => {
        this._afDb.object(`chat_wait/${friend.$id}/${user.id}`)
          .set({
            'roomId': roomId,
            'friend': new ChatListModel({
              $id: user.id,
              picUrl: user.picUrl,
              nick: user.nick
            })
          });
      });
  }

  getChatCallWatcher(): Observable<ChatCallModel[]> {
    return this._userService.getCurrentUser().first()
      .switchMap(user =>
        this._afDb.list(`chat_wait/${user.id}`)
          .map(calls =>
            calls.map(call =>
              new ChatCallModel(Object.assign(call, {
                $id: call.$key,
                friend: new ChatListModel(Object.assign(call.friend, {
                    $id: call.$key
                  })
                )
              }))
            )
          )
      );
  }

  removeWatcher(id: string) {
    this._userService.getCurrentUser().first()
      .delay(1000)
      .subscribe(user => {
        this._afDb.object(`chat_wait/${user.id}/${id}`).remove().then();
      });
  }

  checkRoomAgain(roomId) {
    return this._afDb.object(`${ChatService.PATH}/room/chat_list/${roomId}`)
      .switchMap(room => {
        if (room.$exists()) {
          return Observable.of(false);
        } else {
          return Observable.of(true);
        }
      });
  }

  sendTimeStampToFriendList() {

  }
}
