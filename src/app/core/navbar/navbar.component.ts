import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  categories: string[] = [
    'Táborozás',
    'Mászófelszerelés',
    'Védőfelszerelés',
    'Térkép, könyv',
    'Étkezés',
    'Lábbeli',
    'Műszer',
    'Téli felszerelés'
  ];
  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }
}
