import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import {element} from 'protractor';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnDestroy {
  form: FormGroup;
  loading = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  private subscription: Subscription;

  constructor(private _fb: FormBuilder,
              private _http: HttpClient) {
    this.createForm();
    this.run();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  simulateHttp(val: any, delay: number) {
    return Observable.of(val).delay(delay);
  }

  simulateFirebase(val: any, delay: number) {
    return Observable.interval(delay).map(index => {
      if (index % 2 === 0) {
        return true;
      } else {
        return false;
      }
     });
  }


  run() {
    console.log('simulating HTTP requests');
    const http1$ = this.simulateHttp('user1', 2000);
    const http2$ = this.simulateHttp('user2', 1000);

    // http1$.subscribe(
    //   console.log,
    //   console.error,
    //   () => console.log('http1$ completed'));
    //
    // http2$.subscribe(
    //   console.log,
    //   console.error,
    //   () => console.log('http2$ completed'));

    // http2$.flatMap(res => {
    //   console.log(res);
    //   return http1$;
    // }).subscribe(res => console.log(res));
    // http1$.flatMap(() => http2$, (e, k, ie, ik) => {
    //   console.log(e, k, ie, ik);
    // }).subscribe(res => console.log(res));

    // http2$.switchMap(res => {
    //   console.log(res);
    //   return http1$;
    // }).subscribe(res => console.log(res));

    // http2$.switchMap(() => http1$, (e, k, ie, ik) => {
    //   console.log(e, k, ie, ik);
    // }).subscribe(res => console.log(res));

    const fire1$ = this.simulateFirebase(true, 10000);
    const fire2$ = this.simulateFirebase('kettes', 1000).take(5);

    this.subscription = fire1$
      .flatMap(isLoggedIn => {
        if (isLoggedIn) {
          console.log(isLoggedIn);
          return http1$;
        } else {
          console.log('null');
          return Observable.of(null);
        }
      })
        .subscribe(user => console.log(user));

    // fire1$.subscribe(isLoggedIn => {
    //   if (isLoggedIn) {
    //     console.log(isLoggedIn);
    //     http1$.subscribe(user => {
    //       console.log(user);
    //     }).unsubscribe();
    //   } else {
    //     console.log('null');
    //   }
    // });

    // fire1$.subscribe(
    //   console.log,
    //   console.error,
    //   () => console.log('fire1$ completed'));
    //
    // fire2$.subscribe(
    //   console.log,
    //   console.error,
    //   () => console.log('fire2$ completed'));

    // fire1$.switchMap((res) => {
    //   console.log(res);
    //   return http2$;
    // }).subscribe(res => console.log(res));
    // fire1$.flatMap(() => fire2$, (e, k, ie, ik) => {
    //   console.log(e, k, ie, ik);
    // }).subscribe(res => console.log(res));

  }


  createForm() {
    this.form = this._fb.group({
      id: ['', Validators.required],
      avatar: null
    });
  }

  onFileChange(event) {
    if (event.srcElement.files.length > 0) {
      const files = event.srcElement.files[0];
      this.form.get('avatar').setValue(files);
    }
    console.log(this.form.get('avatar').value);
  }

  private prepareSave(): any {
    const input = new FormData();
    console.log(this.form.get('avatar').value);
    input.append('valami', 'valami');
    input.append('id', this.form.get('id').value);
    input.append('avatar', this.form.get('avatar').value);
    console.log('input with Data: ', input);
    return input;

  }

  onSubmit() {
    const formModel = this.prepareSave();
    console.log(formModel);
    this.loading = true;
    this._http.post('http://localhost/turazzunk/avatar.php', formModel)
      .subscribe(res => console.log(res));
    this.loading = false;
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }




}
