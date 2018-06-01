import { Injectable } from '@angular/core';
import {Title, Meta, MetaDefinition} from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {ItemModel} from './item-model';
import {EventModel} from './event-model';
import {environment} from '../../environments/environment';
import {WindowRef} from './windowRef';

@Injectable()

export class SEOServiceService {

  constructor(
    private _titleService: Title,
    private _metaService: Meta,
    private _router: Router,
    private _windowRef: WindowRef
  ) {}

  addSeoData(): void {
    this._router.events.filter((event: any) => event instanceof NavigationEnd).subscribe(() => {
      let root = this._router.routerState.snapshot.root;
      console.log(this._router.routerState.snapshot.url);
      while (root) {
        if (root.children && root.children.length) {
          root = root.children[0];
        } else if (root.data && root.data['title']) {
          this._titleService.setTitle(root.data['title'] + ' | Turazzunk!');
          this.removeTags();
          const tags = root.data['metatags'];
          for (const tag of Object.keys(tags)) { // tag: name, property
            for (const t of Object.keys(tags[tag])) { // t: description, keywords, og:dolgok
              this._metaService.addTag({[tag]: t, content: tags[tag][t]});
            }
          }
          const urls = ['/kezdolap', '/cuccok', '/turak', '/tobbiek'];
          if (urls.indexOf(this._router.routerState.snapshot.url) > -1) {
            this._windowRef.nativeWindow.prerenderReady = true;
            console.log('prerenderReady true');
          }
          return;
        } else {
          return;
        }
      }
    });
  }

  removeTags(): void {
    ['description', 'keywords', 'robots'].map(name => {
      this._metaService.removeTag(`name="${name}"`);
    });
    this._metaService.removeTag('property="og:title"');
    ['og:title', 'og:type', 'og:url', 'og:image', 'og:description', 'og:site_name'].map(property => {
      this._metaService.removeTag(`property="${property}"`);
    });
  }

  setTitle(title: string): void {
    this._titleService.setTitle(title);
  }

  setMeta(model: ItemModel | EventModel): void {
    let urlPart: string;
    let image: string;
    let description: string;
    if (model instanceof ItemModel) {
      urlPart = 'cuccok';
      image = environment.links.noImageItems;
      description = model.shortDescription;
    } else {
      urlPart = 'turak';
      image = environment.links.noImageEvents;
      description = `Nézd meg oldalunkon a(z) "${model.title}" túrát! Ha tetszik, rögtön csatlakozhatsz is!`;
    }
    const value = [
      {
        property: 'og:title',
        content: model.title
      }, {
        property: 'og:type',
        content: 'website'
      }, {
        property: 'og:url',
        content: `https://${environment.links.home}/${urlPart}/view/${model.id}`
      }, {
        property: 'og:image',
        content: model.picUrl ? model.picUrl : image
      }, {
        property: 'og:description',
        content: description
      }, {
        property: 'og:site_name',
        content: 'Túrázzunk!'
      }, {
        name: 'description',
        content: description
      }, {
        name: 'keywords',
        content: model.title.split(' ').concat([model.category]).join(', ')
      }
    ];
    value.map(elem => {
      this._metaService.updateTag(elem);
    });
    this._windowRef.nativeWindow.prerenderReady = true;
    console.log('prerenderReady true');
  }

  noRobots(): void {
    this._metaService.addTag({name: 'robots', content: 'noindex, nofollow'});
  }

  noIndex(): void {
    this.removeTags();
    this.noRobots();
    this._windowRef.nativeWindow.prerenderReady = true;
    console.log('prerenderReady true');
  }
}
