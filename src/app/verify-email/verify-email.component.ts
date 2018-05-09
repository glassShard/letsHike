import {Component} from '@angular/core';
import {UserService} from '../shared/user.service';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  error = false;
  success = false;
  disabled = false;

  constructor(public modalRef: BsModalRef,
              private _userService: UserService) {
  }

  clearError() {
    delete(this.error);
  }

  verifyEmail() {
    this.disabled = true;
    this.error = false;
    this._userService.verifyEmail().subscribe(() => {
      this.success = true;
    }, err => {
      this.error = true;
      this.disabled = false;
    });
  }
}

// TODO: hiába ellenőrzi az email címet, nem frissül az adat, így újra be kell töltenie az oldalt


