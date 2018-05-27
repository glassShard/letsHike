import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollapsibleComponent} from './collapsible.component';
import {CollapseModule} from 'ngx-bootstrap';
import {EventCardModule} from '../../event-card/event-card.module';
import {ItemCardModule} from '../../item-card/item-card.module';
import {CoreModule} from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    EventCardModule,
    ItemCardModule,
    CollapseModule,
    CoreModule
  ],
  declarations: [
    CollapsibleComponent
  ],
  exports: [
    CollapsibleComponent
  ]
})

export class CollapsibleModule {
}
