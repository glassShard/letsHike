import {AbstractControl} from '@angular/forms';
export class PasswordMatchValidator {

  static PasswordMatch(AC: AbstractControl) {
    const password = AC.get('password').value;
    const passwordAgain = AC.get('passwordAgain').value;
    if (password !== passwordAgain) {
      AC.get('passwordAgain').setErrors({validatePasswordMatch: true});
    }
  }
}


