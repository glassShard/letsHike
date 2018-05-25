import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ItemModel} from '../../shared/item-model';
import {ItemService} from '../../shared/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import 'rxjs/add/operator/share';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit, OnDestroy {
  public item$: Observable<ItemModel>;
  public currentUser: UserModel;
  public root = environment.links.root;
  public swiperIndex = 0;
  public showImageSwiper: boolean;
  private _subscriptions: Subscription[] = [];
  public showChat = false;
  public recipientsId: string[] = [];
  public emailModalTitle: string;
  public creatorId: string;
  public modalRef: BsModalRef;
  public error: string;

  constructor(private _route: ActivatedRoute,
              private _itemService: ItemService,
              private _router: Router,
              private _userService: UserService,
              private _modalService: BsModalService) {
  }

  ngOnInit() {
    this._subscriptions.push(this._userService.isLoggedIn$
      .flatMap(isLoggedIn => {
        if (isLoggedIn) {
          return this._userService.getCurrentUser();
        } else {
          return Observable.of(null);
        }
      }).subscribe(user => {
        this.currentUser = user;
      })
    );

    const itId = this._route.snapshot.params['id'];
    if (itId) {
      this.item$ = this._itemService.getItemById(itId).share();
      this._subscriptions.push(this.item$.subscribe(it => {
        if (it !== null) {
          this.creatorId = it.creatorId;
        } else {
          this._router.navigate(['404']);
        }
      }));
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  onDelete(itemId) {
    this._itemService.delete(itemId)
      .subscribe(
        (res) => console.log(res),
          // this._router.navigate(['/cuccok']),
        (err) => {
          this.error = 'A törlés során hibák léptek fel. Kérjük, próbáld újra!';
          console.warn(`Problémánk van a tölésnél: ${err}`);
        }
      );
  }

  onEdit(itemId) {
    this._router.navigate(['/cuccok', itemId]);
  }

  clicked(index) {
    this.swiperIndex = index;
    this.showImageSwiper = true;
  }

  closeChat() {
    this.showChat = false;
  }

  showEmailModalWindow(template: TemplateRef<any>) {
    this.emailModalTitle = 'Email a hirdetőnek';
    this.recipientsId = [this.creatorId];
    this.modalRef = this._modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }
}
