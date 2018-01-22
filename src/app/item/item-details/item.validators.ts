import {FormControl} from '@angular/forms';

export function priceValidator(formControl: FormControl) {
  if (parseInt(formControl.value, 0) < 0) {
    return {
      'validateMinPrice': true
    };
  }
}

// Ha kívülről akarunk a validációhoz paramétert átadni, akkor a külső fv-be
// adjuk át a paramétert, viszont ilyenkor a hívó oldalon fv-ként
// (zárójellel, paraméterrel benne) kell meghívni. 2/1 1:20
// export function priceValidator() {
//   return function(formControl: FormControl) {
//     if (parseInt(formControl.value, 0) < 0) {
//       return {
//         'validateMinPrice': true
//       };
//     }
//   };
// }
