import { Component, OnInit } from '@angular/core';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  isCollapsed = true;
  public itemsGrouppedBy2: ItemModel[];

  constructor(private _itemService: ItemService) { }

  ngOnInit() {
    this.itemsGrouppedBy2 = this._itemService.getAllItems()
      .reduce((acc, curr: ItemModel, ind: number) => {
        if (ind % 2 === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(curr);
        return acc;
      }, [])
      .reduce((acc, curr, ind) => {
        if (ind % 2 === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(curr);
        return acc;
      }, []);

    console.log(this.itemsGrouppedBy2);
  }

}

