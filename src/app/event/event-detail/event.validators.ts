import {FormControl} from '@angular/forms';

export function futureValidator(formControl: FormControl) {
  if (formControl.value < Math.floor(Date.now() / 1000) ) {
    return {
      'validateFuture': true
    };
  }
}

