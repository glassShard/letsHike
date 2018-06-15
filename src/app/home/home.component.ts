import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EventService} from '../shared/event.service';
import {ItemService} from '../shared/item.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public items: number;
  public events: number;
  private _subscriptions: Subscription[] = [];
  @ViewChild('logo') logo: ElementRef;
  public bigLogo = false;

  constructor(private _eventService: EventService,
              private _itemService: ItemService) {
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.setBigLogo();
    this._subscriptions.push(this._itemService.getAllItems()
      .subscribe(items => this.items = items.length));
    this._subscriptions.push(this._eventService.getAllEvents()
      .subscribe(events => this.events = events.length));
  }

  @HostListener('window:resize') resize() {
    let resizeTimeout;
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        this.setBigLogo();
      }, 300);
    }
  }

  setBigLogo() {
    this.bigLogo = this.logo.nativeElement.clientWidth > 0;
  }
}
