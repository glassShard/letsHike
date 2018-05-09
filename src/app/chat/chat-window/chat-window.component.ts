import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ChatMessageModel} from '../model/chat.model';
import {Observable} from 'rxjs/Observable';
import {ChatService} from '../chat.service';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/concat';
import {ChatListModel} from '../model/chat-list.model';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @Input() id: string;
  @Input() roomId: string;
  @Input() title: string;
  @Input() closeable = true;
  @Input() isNewFriend = true;
  @Input() friend: ChatListModel;
  resetForm = false;
  chatMessage$: Observable<ChatMessageModel[]>;
  @ViewChild('cardBody') cardBody: ElementRef;
  @Output() closeChatWindow = new EventEmitter<void>();
  @Output() addFriend = new EventEmitter<string>();
  @Output() addNewMessageFlag = new EventEmitter<ChatListModel>();
  @Output() sendTick = new EventEmitter<string>();
  @Input() @HostBinding('class.floating') floating = true;
  subscriptions: Subscription[] = [];
  private shouldScroll = true;

  constructor(private _chatService: ChatService,
              private _cdr: ChangeDetectorRef) {
    this.subscriptions.push(new TimerObservable(1000, 1000)
      .subscribe(tick => {
        this.sendTick.emit();
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.chatMessage$.subscribe(() => {
      this.shouldScroll = true;
      this._cdr.detectChanges();
      this.ngAfterViewChecked();
    }));
    this._cdr.detach();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.cardBody.nativeElement.scrollTo(0, this.cardBody.nativeElement.scrollHeight);
      this.shouldScroll = false;
    }
  }

  ngOnInit() {
    this.chatMessage$ = this._chatService.getRoomMessages(`room/${this.roomId}`);
    this.chatMessage$.first().delay(300).subscribe(messages => {
        if (this.isNewFriend === true) {
          if (messages.length > 0) {
            this.isNewFriend = false;
            console.log(this.isNewFriend);
          }
        }
        this.shouldScroll = true;
        this._cdr.detectChanges();
        this.ngAfterViewChecked();
      }
    );
  }

  onNewMessage(message: string) {
    console.log('roomId: ', this.roomId);
    console.log('message: ', message);
    console.log('this.friend: ', this.friend);
    let newFriendObs: Observable<any>;
    if (this.isNewFriend === true) {
      newFriendObs = this._chatService.checkRoomAgain(this.roomId)
        .switchMap(isNewFriend => {
          let needAddFriendObs: Observable<any>;
          if (isNewFriend) {
            needAddFriendObs = this._chatService.addFriend(this.friend);
            this.isNewFriend = false;
          } else {
            needAddFriendObs = Observable.of(null);
          }
          return needAddFriendObs;
        });
    } else {
      newFriendObs = Observable.of(null);
    }
    newFriendObs
      .switchMap(() => this._chatService.addMessage(`room/${this.roomId}`, message, this.friend))
      .subscribe(res => {
        if (res) {
          this.resetForm = true;
          this._cdr.detectChanges();
        } else {
          alert('hiba az üzenet küldése közben');
        }
      });
  }

  trackByMessages(index: number, model: ChatMessageModel) {
    return model.$id;
  }

  closeChat() {
    this.closeChatWindow.emit();
  }
}

// TODO: cloud functionnal törölni az archivált vagy törölt eventek és
// itemek chatszobáját.
