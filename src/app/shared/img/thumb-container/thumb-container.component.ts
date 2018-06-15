import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnDestroy, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {EventModel} from '../../event-model';
import {ItemModel} from '../../item-model';
import {environment} from '../../../../environments/environment';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-thumb-container',
  templateUrl: './thumb-container.component.html',
  styleUrls: ['./thumb-container.component.css']
})
export class ThumbContainerComponent implements OnInit, OnDestroy {
  @Input() model: EventModel | ItemModel;
  public images: string[] = [];
  @Output() imgClicked = new EventEmitter();
  public root = environment.links.root;
  @ViewChild('container') thumbContainer: ElementRef;
  private _detectOnLoad = new ReplaySubject<boolean[]>(1);
  private arrayToDetect: boolean[] = [];
  private _detectOnLoadSubscription: Subscription;

  constructor() {
    this._detectOnLoadSubscription = this._detectOnLoad.subscribe(images => {
      if (images.length === this.thumbContainer.nativeElement.children.length) {
        this._detectOnLoadSubscription.unsubscribe();
        this.renderImages(1);
      }
    });
  }

  ngOnInit() {
    this.model.images.split(',').map(path => {
      const pathArray = path.split('/');
      const fileName = pathArray.pop();
      path = pathArray.join('/') + `/thumbs/${fileName}`;
      this.images.push(`${path}`);
    });
  }

  ngOnDestroy() {
    if (!this._detectOnLoadSubscription.closed) {
      this._detectOnLoadSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize') resize() {
    let resizeTimeout;
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        Array.from(this.thumbContainer.nativeElement.children).map((image: any) => {
          image.height = 120;
          image.width = image.naturalWidth * 120 / image.naturalHeight;
        });
        this.renderImages(2);
      }, 100);
    }
  }

  renderImages(callingFrom) {
    const container = (this.thumbContainer.nativeElement);
    const images = Array.from(container.children);
    const reducedContainer: any = images.reduce((acc: any[], curr: any) => {
      if (acc.length === 0) {
        acc.push([curr]);
      } else {
        const totalWidth: number = acc[acc.length - 1].reduce((innerAcc, innerCurr) => {
          return innerAcc + innerCurr.offsetWidth;
        }, 0);
        if (totalWidth + curr.offsetWidth < container.clientWidth) {
          acc[acc.length - 1].push(curr);
        } else {
          acc.push([curr]);
        }
      }
      return acc;
    }, []);
    reducedContainer.map(array => {
      const imagesWidth = array.reduce((acc, curr) => acc + curr.width, 0);
      const ratio = array[0].width / imagesWidth;
      const newWidth = ratio * container.clientWidth;
      const growRatio = newWidth / array[0].width;
      const modArray = array.map((img, index) => {
        img.height = Math.ceil(growRatio * img.height);
        if (index % 2 === 0) {
          img.width = Math.ceil(img.height / img.naturalHeight * img.naturalWidth);
        } else {
          img.width = Math.floor(img.height / img.naturalHeight * img.naturalWidth);
        }
        return img;
      });

      if (array === reducedContainer[reducedContainer.length - 1] && imagesWidth < container.clientWidth / 2) {
        array.map(img => {
          if (reducedContainer.length > 1) {
            img.height = reducedContainer[reducedContainer.length - 2][0].height;
          } else {
            img.height = 120;
          }
          img.width = Math.floor(img.height / img.naturalHeight * img.naturalWidth);
        });
      } else {
        modArray[modArray.length - 1].width = container.clientWidth - (modArray.reduce((acc, curr) => {
          return acc + curr.width;
        }, 0) - modArray[modArray.length - 1].width);
      }
    });
    if (callingFrom === 1) {
      const timer = new Observable(observer => {
        let tick = 0;
        setInterval(() => {
          observer.next(tick);
          tick++;
        }, 50);
        return () => console.log('end timer');
      });
      const timerSubscription = timer.subscribe((tick: number) => {
        container.children[tick].style.opacity = 1;
        if (tick === container.children.length - 1) {
          timerSubscription.unsubscribe();
        }
      });
    }
  }

  onLoad() {
    this.arrayToDetect.push(true);
    this._detectOnLoad.next(this.arrayToDetect);
  }

  onError(event) {
    event.target.remove();
  }

  clicked(i: number) {
    this.imgClicked.emit({'index': i});
  }
}
