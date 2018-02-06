import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {UsersComponent} from './users/users.component';

const routes: Routes = [
  {path: 'kezdolap', component: HomeComponent},
  {path: 'tobbiek', component: UsersComponent},

  {path: 'turak', loadChildren: 'app/event/event.module#EventModule'},
  {path: 'cuccok', loadChildren: 'app/item/item.module#ItemModule'},
  {path: 'user', loadChildren: 'app/user/user.module#UserModule'},

  {path: '', redirectTo: '/kezdolap', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  static routableComponents = [
    HomeComponent,
    UsersComponent,
    PageNotFoundComponent
  ];
}
