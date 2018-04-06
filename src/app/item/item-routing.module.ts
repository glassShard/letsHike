import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ItemComponent} from './item.component';
import {ItemDetailsComponent} from './item-details/item-details.component';
import {ItemListComponent} from './item-list/item-list.component';
import {ItemViewComponent} from './item-view/item-view.component';
import {LoggedInGuard} from '../shared/logged-in.guard';

const routes: Routes = [
  {path: '', component: ItemComponent, children: [
      {path: '', component: ItemListComponent},
      {path: 'new', component: ItemDetailsComponent, canActivate: [LoggedInGuard]},

      {path: 'view/:id', component: ItemViewComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
