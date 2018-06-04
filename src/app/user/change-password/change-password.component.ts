import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {BsModalRef} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordMatchValidator} from '../password.match.validator';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public error: string;
  public success: string;
  public form: FormGroup;
  public submitted = false;

  constructor(public modalRef: BsModalRef,
              private _fb: FormBuilder,
              private _userService: UserService) {
  }

  ngOnInit() {
    const passwordPattern = '^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]*$';
    this.form = this._fb.group(
      {
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern(passwordPattern),
        ])],
        passwordAgain: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern(passwordPattern),
        ])],
        oldPassword: ['', Validators.required]
      }, {
        validator: PasswordMatchValidator.PasswordMatch
      }
    );
  }

  onClick(newPassword) {
    let setButtonSubscription = new Subscription();
    this.clearError();
    this.submitted = true;
    if (this.form.valid) {
      this._userService.reAuth(this.form.get('oldPassword').value)
        .switchMap((res) => {
          return this._userService.changePassword(newPassword);
        })
        .subscribe(() => {
          this.success = 'A jelszót sikeresen módosítottuk.';
        }, err => {
          this.error = 'A jelszó módosítása közben hiba történt. Kérjük, próbáld újra.';
        });
    } else {
      setButtonSubscription = this.form.statusChanges
        .subscribe(res => this.submitted = (res !== 'VALID'));
    }
  }

  clearError() {
    delete this.error;
  }
}
