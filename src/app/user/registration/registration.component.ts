import {
  Component, ElementRef, OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/mergeMap';
import {FileService} from '../../shared/file.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public submitted = false;
  public user: UserModel;
  public form: FormGroup;
  public avatar: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  private _subscription: Subscription;

  constructor(private _userService: UserService,
              private _router: Router,
              private _fb: FormBuilder,
              private _fileService: FileService) {
    this._subscription = this._userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this._userService.logout();
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnInit() {
    const passwordPattern = '^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]*$';
    this.form = this._fb.group(
      {
        nick: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(15)])],
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
        email: ['', Validators.compose([
          Validators.required,
          Validators.email])],
        dateOfBirth: null,
        tel: '',
        avatar: null,
      }
    );
    this.user = new UserModel;
  }

  onFileChange(event) {
    if (event.srcElement.files.length > 0) {
      const files = event.srcElement.files[0];
      this.form.get('avatar').setValue(files);

      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (ev) => {
        console.log(ev);
        console.log(ev.target);
        this.avatar = reader.result;
      };
    }
  }

  onSubmit() {

    if (this.form.valid) {
      this.submitted = true;
      let userId = '';
      const password = this.form.get('password').value;

      this.user.nick = this.form.get('nick').value;
      this.user.email = this.form.get('email').value;
      this.user.tel = this.form.get('tel').value;
      this.user.dateOfBirth = !(this.form.get('dateOfBirth').value === null)
        ? new Date(this.form.get('dateOfBirth').value).getTime() / 1000 : null;
      this.user.tel = this.form.get('tel').value;

      if (this.avatar) {
        this._userService.register(this.user, password)
          .flatMap(user => {
            const formModel = this.prepareSave(user.id);
            userId = user.id;
            return this._fileService.uploadAvatar(userId, formModel);
          }).subscribe(data => {
            console.log(data);
          },
          err => console.warn(err));
      } else {
        this._userService.register(this.user, password)
          .subscribe(data => console.log(data), err => console.warn(err));
      }
    }
  }

  private prepareSave(id): FormData {
    const input = new FormData();
    input.append('id', id);
    input.append('avatar', this.form.get('avatar').value);
    return input;
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.avatar = null;
  }
}
