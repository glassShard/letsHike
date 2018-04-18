import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, HostBinding,
  Input,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {ChatMessageModel} from '../model/chat.model';
import {Observable} from 'rxjs/Observable';
import {ChatService} from '../chat.service';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/delay';
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/concat";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @Input() id: string;
  @Input() roomId: string;
  @Input() title: string;
  @Input() closeable = true;
  @Input() new = true;
  resetForm = false;
  chatMessage$: Observable<ChatMessageModel[]>;
  @ViewChild('cardBody') cardBody: ElementRef;
  private shouldScroll = true;
  @Output() closeChatWindow = new EventEmitter<void>();
  @Output() addFriend = new EventEmitter<string>();
  @Input() @HostBinding('class.floating') floating = true;

  constructor(private _chatService: ChatService,
              private _cdr: ChangeDetectorRef) {
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
      if (this.new === true) {
        if (messages.length > 0) {
          this.new = false;
          console.log(this.new);
        }
      }
      this.shouldScroll = true;
      this._cdr.detectChanges();
      this.ngAfterViewChecked();
      }
    );
  }

  onNewMessage(newMessage: string) {
    if (this.new === true) {
      console.log(this.roomId);
      this._chatService.checkRoomAgain(this.roomId)
        .switchMap(isNew => {
          if (isNew) {
            console.log('newRoom');
            this.addFriend.emit();
          }
          return this._chatService.addMessage(`room/${this.roomId}`, newMessage);
        }).subscribe(res => {
          if (res) {
            this.resetForm = true;
            this._cdr.detectChanges();
          } else {
            alert('hiba a chat üzenet küldése közben');
          }
        });
      } else {
        this._chatService.addMessage(`room/${this.roomId}`, newMessage)
          .subscribe(res => {
            if (res) {
              this.resetForm = true;
              this._cdr.detectChanges();
            } else {
              alert('hiba a chat üzenet küldése közben');
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
