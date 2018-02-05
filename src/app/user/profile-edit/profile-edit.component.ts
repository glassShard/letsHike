import {
  Component, ElementRef, OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import {UserService} from '../../shared/user.service';
import {UserModel} from '../../shared/user-model';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/mergeMap';
import {FileService} from '../../shared/file.service';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {LoginModalComponent} from '../../core/login-modal/login-modal.component';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  public currentUser: UserModel;
  public submitted = false;
  public userEmail: string;
  public form: FormGroup;
  public avatar: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  private subscription: Subscription;
  public modalRef: BsModalRef;

  constructor(private _userService: UserService,
              private _router: Router,
              private _route: ActivatedRoute,
              private _fb: FormBuilder,
              private _fileService: FileService,
              private _modalService: BsModalService) {  }

  ngOnInit() {
    const handle404 = () => {
      this._router.navigate(['404']);
    };

    this.form = this._fb.group(
      {
        nick: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(15)])],
        email: ['', Validators.compose([
          Validators.required,
          Validators.email])],
        dateOfBirth: null,
        tel: '',
        avatar: null,
      }
    );

    this.subscription = this._userService.isLoggedIn$
    .flatMap(isLoggedIn => {
      if (isLoggedIn) {
        return this._userService.getCurrentUser();
      } else {
        return Observable.of(null);
      }
    })
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userEmail = user.email;
        console.log(user);
        this.fillForm();
      } else {
        this._router.navigate(['./registration']);
      }
    });
  }

  fillForm () {
    if (this.currentUser.id) {
      console.log(true);
      let date: string = null;
      if (this.currentUser.dateOfBirth) {
        const unixDate = new Date(this.currentUser.dateOfBirth * 1000);
        date = unixDate.toJSON().substr(0, 10);
      }
      this.form.patchValue({
        nick: this.currentUser.nick,
        email: this.currentUser.email,
        dateOfBirth: date,
        tel: this.currentUser.tel,
        picUrl: this.currentUser.picUrl
      });
    } else {
      this.currentUser = new UserModel;
    }
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
    this.submitted = true;
    if (this.form.valid) {

      this.currentUser.nick = this.form.get('nick').value;
      this.currentUser.email = this.form.get('email').value;
      this.currentUser.tel = this.form.get('tel').value;
      this.currentUser.dateOfBirth = !(this.form.get('dateOfBirth').value === null)
        ? new Date(this.form.get('dateOfBirth').value).getTime() / 1000 : null;
      this.currentUser.tel = this.form.get('tel').value;

      if (this.currentUser.email === this.userEmail) {
        if (this.avatar) {
          this._userService.modify(this.currentUser)
            .flatMap(() => {
              const formModel = this.prepareSave(this.currentUser.id);
              return this._fileService.uploadAvatar(this.currentUser.id, formModel);
            }).subscribe(res => console.log(res), err => console.warn(err));
        } else {
          this._userService.modify(this.currentUser)
            .subscribe(data => console.log(data), err => console.warn(err));
        }
      } else {
        console.log('itt');
        this._userService.changeEmail(this.currentUser.email)
          .subscribe(res => console.log(res));
      }
      this._router.navigate(['/user']);
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

  clearPicUrl() {
    this.currentUser.picUrl = '';
  }

  show() {
    const initialState = {
      modalTitle: 'Belépési adatok',
      text: 'Az e-mail cím megváltoztatásához kérjük, erősítsd' +
      ' meg, hogy tényleg Te vagy:',
      rememberMe: false,
      closeBtnName: 'Mehet'
    };
    this.modalRef = this._modalService.show(LoginModalComponent);
    Object.assign(this.modalRef.content, initialState);
    console.log(this.modalRef);
  }

}

