import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventListComponent} from './event-list/event-list.component';
import {EventViewComponent} from './event-view/event-view.component';
import {EventDetailComponent} from './event-detail/event-detail.component';
import {EventComponent} from './event.component';
import {LoggedInGuard} from '../shared/logged-in.guard';

const routes: Routes = [
  {path: '', component: EventComponent, children: [
      {path: '', component: EventListComponent},
      {path: 'new', component: EventDetailComponent},
      {path: ':id', component: EventDetailComponent, canActivate: [LoggedInGuard]},
      {path: 'view/:id', component: EventViewComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
