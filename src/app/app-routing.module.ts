import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'kezdolap',
    component: HomeComponent,
    data: {
      title: 'Kezdőlap',
      metatags: {
        name: {
          description: 'Keress, vagy adj el túracuccokat, csatlakozz szuper túraprogramokhoz,' +
          ' melyeket a közösség tagjai szerveznek!',
          keywords: 'mászócuccok, túrafelszerelés, túraprogramok, kalandok',
          robots: 'index, follow'
        },
        property: {
          'og:title': 'Kezdőlap',
          'og:type': 'website',
          'og:url': 'https://turazzunk.hu',
          'og:image': 'https://turazzunk.hu/img/placeholders/fbHomePage.jpg',
          'og:description': 'Keress, vagy adj el túracuccokat, csatlakozz szuper túraprogramokhoz,' +
          ' melyeket a közösség tagjai szerveznek!',
          'og:site_name': 'Túrázzunk!'
        }
      }
    }
  }, {
    path: 'tobbiek',
    loadChildren: 'app/users/users.module#UsersModule',
    data: {
      title: 'Többiek',
      metatags: {
        name: {
          description: 'Vedd fel a kapcsolatot a többiekkel: Chatelj, emailezz - aztán' +
          ' találkozzatok élőben is valamelyik túrán!',
          keywords: 'túrapartnerek',
          robots: 'index, follow'
        },
        property: {
          'og:title': 'Többiek',
          'og:type': 'website',
          'og:url': 'https://turazzunk.hu/tobbiek',
          'og:image': 'https://turazzunk.hu/img/placeholders/fbOthersPage.jpg',
          'og:description': 'Vedd fel a kapcsolatot a többiekkel: Chatelj, emailezz - aztán' +
          ' találkozzatok élőben is valamelyik túrán!',
          'og:site_name': 'Túrázzunk!'
        }
      }
    }
  }, {
    path: 'turak',
    loadChildren: 'app/event/event.module#EventModule',
    data: {
      title: 'Túrák',
      metatags: {
        name: {
          description: 'Keress, vagy szervezz túrát, találj hozzá partnereket. Ne hagyd ki a' +
          ' legnagyobb kalandokat!',
          keywords: 'kalandok, túrák, via ferrata, magashegyi túra, sítúra, gyalogtúra,' +
          ' kerékpártúra, hótalpas túra',
          robots: 'index, follow'
        },
        property: {
          'og:title': 'Túrák',
          'og:type': 'website',
          'og:url': 'https://turazzunk.hu/turak',
          'og:image': 'https://turazzunk.hu/img/placeholders/fbEventsPage.jpg',
          'og:description': 'Keress, vagy szervezz túrát, találj hozzá partnereket. Ne hagyd' +
          ' ki a legnagyobb kalandokat!',
          'og:site_name': 'Túrázzunk!'
        }
      }
    }
  }, {
    path: 'cuccok',
    loadChildren: 'app/item/item.module#ItemModule',
    data: {
      title: 'Cuccok',
      metatags: {
        name: {
          description: 'Ha használt túracuccot keresel, itt biztosan megtalálod! Akkor is jó' +
          ' helyen vagy, ha te akarsz ilyesmit eladni.',
          keywords: 'ruházat, kötél, védőfelszerelés, mászófelszerelés, táborozás, étkezés,' +
          ' térkép, könyv, téli felszerelés, hátizsák, táska',
          robots: 'index, follow'
        },
        property: {
          'og:title': 'Cuccok',
          'og:type': 'website',
          'og:url': 'https://turazzunk.hu/cuccok',
          'og:image': 'https://turazzunk.hu/img/placeholders/fbItemsPage.jpg',
          'og:description': 'Ha használt túracuccot keresel, itt biztosan megtalálod! Akkor is' +
          ' jó helyen vagy, ha te akarsz ilyesmit eladni.',
          'og:site_name': 'Túrázzunk!'
        }
      }
    }
  }, {
    path: 'user',
    loadChildren: 'app/user/user.module#UserModule',
  }, {
    path: '',
    redirectTo: '/kezdolap',
    pathMatch: 'full'
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  static routableComponents = [
    HomeComponent,
    PageNotFoundComponent
  ];
}
