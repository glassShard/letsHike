import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {CategoryService} from "../../shared/category.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public itemCategories;
  public eventCategories;

  constructor(public userService: UserService,
              private _categoryService: CategoryService) { }

  ngOnInit() {
    this.itemCategories = this._categoryService.getItemCategories();
    this.eventCategories = this._categoryService.getEventCategories();
  }

  logout() {
    this.userService.logout();
  }
}
