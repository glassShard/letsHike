import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {ProfilesComponent} from './profiles/profiles.component';
import {UserListComponent} from './user-list/user-list.component';
import {LoggedInGuard} from '../shared/logged-in.guard';

const routes: Routes = [
  {path: '', component: UsersComponent, children: [
      {path: '', component: UserListComponent},
      {path: ':id', component: ProfilesComponent, canActivate: [LoggedInGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsersRoutingModule {}
