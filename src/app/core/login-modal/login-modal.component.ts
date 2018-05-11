 import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {UserService} from '../../shared/user.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  forgottenSuccess = false;
  forgottenError: string;
  forgottenDisabled = false;
  modalTitle: string;
  closeBtnName: string;
  needRememberMe: boolean;
  needEmail: boolean;
  text: string;
  isReAuth: boolean;
  error: string;
  authFailed = true;
  forgotten = false;
  @ViewChild('email') email: ElementRef;
  @ViewChild('rememberMe') rememberMe: ElementRef;
  disabled = false;

  constructor(public modalRef: BsModalRef,
              private _userService: UserService) {
  }

  ngOnInit() {
  }

  onClick(password) {
    if (this.isReAuth) {
      this.reAuth(password);
    } else {
      this.login(this.email.nativeElement.value, password);
    }
  }

  login(email: string, password: string) {
    this.disabled = true;
    this._userService.login(email, password).subscribe((res) => {
      console.log(res);
      this.modalRef.hide();
    }, err => {
      this.disabled = false;
      console.warn('hibara futottunk a login során: ', err);
      this.error = 'Hiba a bejelentkezési adatokban. Próbáld újra.';
    });
  }

  reAuth(password) {
    this.disabled = true;
    this._userService.reAuth(password).subscribe(res => {
      console.log(res);
      this.authFailed = false;
      this.modalRef.hide();
    }, err => {
      this.disabled = false;
      console.warn('hibara futottunk az autentikáció során: ', err);
      this.error = 'Hiba az autentikáció során. Próbáld újra.';
      this.authFailed = true;
    });
  }

  clearError() {
    delete(this.error);
  }

  forgottenPassword() {
    this.forgotten = true;
  }

  onForgotten(email) {
    this.forgottenDisabled = true;
    this.forgottenError = null;
    this._userService.sendForgottenPasswordLink(email)
      .subscribe(res => {
        this.forgottenSuccess = true;
      }, error => {
        this.forgottenSuccess = false;
        this.forgottenDisabled = false;
        console.log(error);
        if (error.code === 'auth/user-not-found') {
          this.forgottenError = 'Ezzel az email címmel nincs regisztrált felhasználónk.';
        } else {
          this.forgottenError = 'A linket nem sikerült elküldeni. Kérjük, próbáld újra.';
        }
      });
  }
}
