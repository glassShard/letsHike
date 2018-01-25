import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public error: string;

  constructor(private _userService: UserService,
              private _router: Router) { }

  ngOnInit() {

  }

  login(email: string, password: string) {
    console.log(email, password);
    this._userService.login(email, password).subscribe(
      () => {
        this._router.navigate(['/turak']);
      },
      err => {
        console.warn('hibara futottunk a logincmp-ben', err);
        this.error = 'Hiba a bejelentkezési adatokban. Próbáld újra.';
      }
    );
  }

  clearError() {
    delete(this.error);
  }
}
