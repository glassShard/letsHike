import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {ChatMessageModel} from '../model/chat.model';
import {Observable} from 'rxjs/Observable';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChatService]
})
export class ChatWindowComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @Input() roomId: string;
  resetForm = false;
  chatMessage$: Observable<ChatMessageModel[]>;
  @ViewChild('cardBody') cardBody: ElementRef;
  private shouldScroll = true;
  @Output() closeChatWindow = new EventEmitter();

  constructor(private _chatService: ChatService) {
  }

  ngAfterViewInit(): void {
    console.log(this.cardBody.nativeElement.scrollHeight) ;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      console.log(this.cardBody.nativeElement.scrollHeight);
      this.cardBody.nativeElement.scrollTo(0, this.cardBody.nativeElement.scrollHeight);
      this.shouldScroll = false;
      console.log(this.cardBody.nativeElement.scrollHeight);
    }
  }

  ngOnInit() {
    this.chatMessage$ = this._chatService.getRoomMessages(this.roomId);
  }

  onNewMessage(newMessage: string) {
    this._chatService.addMessage(this.roomId, newMessage)
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.shouldScroll = true;
          this.resetForm = true;
        } else {
          alert('hiba a chat üzenet küldése közben');
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
