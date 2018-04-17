import {
  AfterViewInit, ChangeDetectorRef,
  Component, EventEmitter,
  HostBinding,
  HostListener,
  Input, Output
} from '@angular/core';
import {ChatListModel} from '../model/chat-list.model';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-chat-list-row',
  templateUrl: './chat-list-row.component.html',
  styleUrls: ['./chat-list-row.component.css']
})
export class ChatListRowComponent implements AfterViewInit {
  @Input() friend: ChatListModel;
  @HostBinding('class.clearfix') classClearfix = true;
  @HostBinding('class.focused') classFocused = false;
  @HostBinding('class.text-muted') classTextMuted = true;
  @Output() select = new EventEmitter<ChatListModel>();
  private focus$ = new Subject<boolean>();

  constructor(private _cdr: ChangeDetectorRef) {
    this.focus$.subscribe(value => {
      if (value !== this.classTextMuted) {
        this.classTextMuted = value;
        this.classFocused = !value;
      }
    });
  }

  ngAfterViewInit(): void {
    this._cdr.detach();
  }

  @HostListener('mouseover', ['$event'])
  onHostFocus($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.focus$.next(false);
  }

  @HostListener('mouseout', ['$event'])
  onHostBlur($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.focus$.next(true);
  }

  @HostListener('click', ['$event'])
  onHostClick($event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.select.emit(this.friend);
  }
}
