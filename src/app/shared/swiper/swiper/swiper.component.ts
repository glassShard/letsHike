import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.css']
})
export class SwiperComponent implements OnInit {
  public swiperConfig: SwiperConfigInterface = {
    direction: 'horizontal',
    loop: false,
    speed: 1000,
    pagination: true,
    navigation: true,
    autoplay: {
      delay: 5000,
    },
    keyboard: true
  };
  @Input() images: string;
  @Input() swiperIndex: number;
  @Output() hideImageSwiper = new EventEmitter();
  public root = environment.links.root;
  public swiperImages: any[] = [];

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.swiperConfig.initialSlide = this.swiperIndex;
    this.swiperImages = this.images.split(',')
      .map(image => this._sanitizer.bypassSecurityTrustStyle(`url(${this.root}${image})`));
  }

  hideSwiper() {
    this.hideImageSwiper.emit();
  }

}
