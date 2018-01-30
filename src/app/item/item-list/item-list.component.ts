import {
  AfterViewInit,
  Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {CategoryService} from '../../shared/category.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import {UserService} from '../../shared/user.service';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinctUntilChanged';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {

  public itemsGrouppedBy2$: Observable<ItemModel[]>;
  public itemCategories;
  public currentUserId: string;
  public newButton = 'Új cucc';
  public title = 'Cuccok';
  private stringFromSearch$ = new BehaviorSubject(null);
  private category$ = new BehaviorSubject(null);


  // @ViewChild('searchInput') searchInput: ElementRef;
  // private filteredText$ = new BehaviorSubject<string>(null);

  constructor(private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _userService: UserService) {
    this._userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.currentUserId = this._userService.currentUserId; // getCurrentUser()
//          .subscribe(user => this.currentUserId = user.id);
      }
    });
  }

  // ngAfterViewInit(): void {
  //   console.log(this.searchInput.nativeElement);
  //   Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
  //     .delay(5000)
  //     .map((event: Event) => {
  //       console.log((event.srcElement as HTMLInputElement).value);
  //       return (event.srcElement as HTMLInputElement).value;
  //
  //     })
  //     .distinctUntilChanged() // ha nem változik az adat minden fél
  //   // másodpercben, akkor nem jelez
  //     .subscribe(text => {
  //       if (text.length === 0) {
  //         text = null;
  //       }
  //       this.filteredText$.next(text);
  //       console.log(text);
  //     });
  // }

  ngOnInit() {
    this.itemCategories = this._categoryService.getItemCategories();
    this.itemsGrouppedBy2$ = this._itemService.getAllItems()
      .flatMap(items => {
        return this.category$
          .map(cat => {
            if (cat === null) {
              return items;
            } else {
              return items.filter(ev => {
                return ev.category === cat;
              });
            }
          });
      })
      .flatMap(items => {
        return this.stringFromSearch$
          .map(filteredText => {
            if (filteredText === null) {
              return items;
            } else {
              return items.filter(item => {
                return (item.title.toLowerCase().indexOf(filteredText.toLowerCase()) > -1
                  || item.shortDescription.toLowerCase().indexOf(filteredText.toLowerCase()) > -1);
              });
            }
          });
      })
      .map(data => {
        return data.reduce((acc, curr: ItemModel, ind: number) => {
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
      });
  }
  assignText(text) {
    this.stringFromSearch$.next(text);
  }

  chooseCategory(category) {
    this.category$.next(category);
  }
}

