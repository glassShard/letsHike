import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, HostBinding,
  Input, OnDestroy,
  OnInit, Output,
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
  private shouldScroll = true;
  @Output() closeChatWindow = new EventEmitter<void>();
  @Output() addFriend = new EventEmitter<string>();
  @Output() addNewMessageFlag = new EventEmitter<ChatListModel>();
  @Output() sendTick = new EventEmitter<string>();
  @Input() @HostBinding('class.floating') floating = true;
  sendTickSubscription: Subscription;

  constructor(private _chatService: ChatService,
              private _cdr: ChangeDetectorRef) {
    this.sendTickSubscription = new TimerObservable(1000, 1000)
      .subscribe(tick => {
        this.sendTick.emit();
    });
  }

  ngOnDestroy() {
    this.sendTickSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.chatMessage$.subscribe(() => {
      this.shouldScroll = true;
      this._cdr.detectChanges();
      this.ngAfterViewChecked();
    });
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

  onNewMessage(newMessage: string) {
    if (this.isNewFriend === true) {
      this._chatService.checkRoomAgain(this.roomId)
        .switchMap(isNewFriend => {
          if (isNewFriend) {
            this.addFriend.emit();
          }
          return this._chatService.addMessage(`room/${this.roomId}`, newMessage, null);
        }).subscribe(res => {
          if (res) {
            this.resetForm = true;
            this._cdr.detectChanges();
          } else {
            alert('hiba a chat üzenet küldése közben');
          }
        });
      } else {
        this._chatService.addMessage(`room/${this.roomId}`, newMessage, this.friend)
          .subscribe(res => {
            if (res) {
              this.resetForm = true;
              this._cdr.detectChanges();
            } else {
              alert('hiba az üzenet küldése közben');
            }
          });
      }


  }

  trackByMessages(index: number, model: ChatMessageModel) {
    return model.$id;
  }

  closeChat() {
    this.closeChatWindow.emit();
  }
}
