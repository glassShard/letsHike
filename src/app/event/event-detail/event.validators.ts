import {FormControl} from '@angular/forms';

export function futureValidator(formControl: FormControl) {
  if (new Date(formControl.value).getTime() < Date.now()) {
    return {
      'validateFuture': true
    };
  }
}

