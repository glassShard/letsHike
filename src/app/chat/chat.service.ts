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
    let newMessage: boolean;
    const created = moment().unix();
    return this._userService.getCurrentUser().first()
      .switchMap(user => {
        if (user) {
          const picUrl = user.picUrl ? user.picUrl : '';
          return Observable.fromPromise(this._afDb.list(`${ChatService.PATH}/${roomId}`).push(
                new ChatMessageModel({
                  $id: null,
                  'msg': msg,
                  userId: user.id,
                  userName: user.nick,
                  userPicUrl: picUrl,
                  'created': created
                })
              )
          )
            .switchMap(messageSent => {
              return this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`).first()
                .switchMap(friendRef => {
                  let updateNewMessageObs: Observable<boolean>;
                  if (friendRef.$exists) {
                    console.log(friendRef.windowOpen, moment().unix());
                    newMessage = created > friendRef.windowOpen;
                    updateNewMessageObs = new Observable<boolean>(observer => {
                      this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`)
                        .update({
                          'newMessage': newMessage,
                          'created': created
                        })
                        .then(() => {
                          observer.next(true);
                          observer.complete();
                        }, error => {
                          observer.next(false);
                          observer.error(error);
                          observer.complete();
                        });
                    });
                  } else {
                    updateNewMessageObs = Observable.of(false);
                  }
                  return updateNewMessageObs;
                });
            });
        }  else { // ha nincs user
          return Observable.of(false);
        }
      });
  }

  // addMessage(roomId: string, msg: string, friend: ChatListModel): Observable<boolean> {
  //   let newMessage: boolean;
  //   const created = moment().unix();
  //   return this._userService.getCurrentUser().first()
  //     .switchMap(user => {
  //       if (user) {
  //         const addMessageObs = new Observable<boolean>(
  //           observer => {
  //             const picUrl = user.picUrl ? user.picUrl : '';
  //             this._afDb.list(`${ChatService.PATH}/${roomId}`).push(
  //               new ChatMessageModel({
  //                 $id: null,
  //                 'msg': msg,
  //                 userId: user.id,
  //                 userName: user.nick,
  //                 userPicUrl: picUrl,
  //                 'created': created
  //               })
  //             ).then(() => {
  //               console.log('then onResolve ág eleje');
  //               observer.next(true);
  //               observer.complete();
  //               console.log('then onResolve ág vége');
  //             }, error => {
  //               observer.next(false);
  //               observer.error(error);
  //               observer.complete();
  //             });
  //           }
  //         );
  //         return addMessageObs
  //         .switchMap(messageSent => {
  //           console.log('üzenet elküldve: ', messageSent);
  //           if (messageSent) {
  //             return this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`).first()
  //               .switchMap(friendRef => {
  //                 let updateNewMessageObs: Observable<boolean>;
  //                 if (friendRef.$exists) {
  //                   console.log(friendRef.windowOpen, moment().unix());
  //                   newMessage = created > friendRef.windowOpen;
  //                   updateNewMessageObs = new Observable<boolean>(observer => {
  //                     this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`)
  //                       .update({
  //                         'newMessage': newMessage,
  //                         'created': created
  //                       })
  //                       .then(() => {
  //                         observer.next(true);
  //                         observer.complete();
  //                       }, error => {
  //                         observer.next(false);
  //                         observer.error(error);
  //                         observer.complete();
  //                       });
  //                   });
  //                 } else {
  //                   updateNewMessageObs = Observable.of(false);
  //                 }
  //                 return updateNewMessageObs;
  //               });
  //           } else { // ha nem sikerült az üzenetet elküldeni
  //             return Observable.of(false);
  //           }
  //         });
  //       }  else { // ha nincs user
  //         return Observable.of(false);
  //       }
  //     });
  // }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    return this._afDb.list(`${ChatService.PATH}/${roomId}`)
      .map(list => {
        return list.map(chatMessage => new ChatMessageModel(Object.assign(chatMessage, {$id: chatMessage.key})));
      });
  }

  addFriend(friend: ChatListModel) {
    return this._userService.getCurrentUser().first()
      .switchMap(user => {
        const friendPicUrl = friend.picUrl ? friend.picUrl : '';
        const userPicUrl = user.picUrl ? user.picUrl : '';
        return Observable.fromPromise(this._afDb.object(`chat_friend_list/${user.id}/${friend.$id}`)
          .set({nick: friend.nick, picUrl: friendPicUrl, newMessage: false, created: moment().unix()}))
          .merge(Observable.fromPromise(this._afDb.object(`chat_friend_list/${friend.$id}/${user.id}`)
            .set({nick: user.nick, picUrl: userPicUrl, windowOpen: 0, created: moment().unix()}))
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

  addChatWait(roomId: string, friend: ChatListModel): void {
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

  checkRoomAgain(roomId: string): Observable<boolean> {
    return this._afDb.object(`${ChatService.PATH}/room/chat_list/${roomId}`).first()
      .switchMap(room => {
        if (room.$exists()) {
          return Observable.of(false);
        } else {
          return Observable.of(true);
        }
      });
  }
}
