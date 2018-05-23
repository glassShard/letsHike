import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
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
import {ImageService} from '../../shared/image.service';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  public currentUser: UserModel;
  public userEmail: string;
  public userOldDatas = {
    dateOfBirth: null,
    email: '',
    nick: '',
    tel: '',
  };
  public form: FormGroup;
  public avatar: any;
  @ViewChild('fileInput') fileInput: ElementRef;
  public modalRefLogin: BsModalRef;
  public modalRefPassword: BsModalRef;
  public disabled = false;
  public error: string;
  public successDel: string;
  public errorDel: string;
  public modalRefDelete: BsModalRef;
  private _saveFailed: boolean;
  private _subscriptions: Subscription[] = [];
  private _loginModalSubscription: Subscription;

  constructor(private _userService: UserService,
              private _router: Router,
              private _route: ActivatedRoute,
              private _fb: FormBuilder,
              private _fileService: FileService,
              private _modalService: BsModalService,
              private _changeDetection: ChangeDetectorRef,
              private _imageService: ImageService) {
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    if (this._saveFailed) {
      Object.assign(this.currentUser, this.userOldDatas);
    }
  }

  ngOnInit() {
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

    this._subscriptions.push(this._userService.isLoggedIn$
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
          Object.assign(this.userOldDatas, {
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            nick: user.nick,
            tel: user.tel
          });
          this.fillForm();
        } else {
          this._router.navigate(['/kezdolap']).then();
        }
      }));
  }

  fillForm() {
    if (this.currentUser.id) {
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
      const file = event.srcElement.files[0];
      console.log(event.srcElement.files);
      console.log(file);
      this._imageService.getOrientation(file)
        .take(1)
        .subscribe(orientation => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          if (orientation === 8 || orientation === 3 || orientation === 6) {
            reader.onload = (ev) => {
              this._imageService.resetOrientation(reader.result, orientation)
                .take(1)
                .subscribe(newImage => this.avatar = newImage);
            };
          } else {
            reader.onload = (ev) => {
              this.avatar = reader.result;
            };
          }
        });
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit() {
    let setButtonSubscription = new Subscription();
    this.disabled = true;
    delete(this.error);
    if (this.form.valid) {

      this.currentUser.nick = this.form.get('nick').value;
      this.currentUser.email = this.form.get('email').value;
      this.currentUser.tel = this.form.get('tel').value;
      this.currentUser.dateOfBirth = !(this.form.get('dateOfBirth').value === null)
        ? new Date(this.form.get('dateOfBirth').value).getTime() / 1000 : null;
      delete this.currentUser.emailVerified;

      if (this.currentUser.email === this.userOldDatas.email) {
        this.saveChanges();
      } else {
        this.show('email');
      }
      // this._router.navigate(['/user']);
    } else {
      setButtonSubscription = this.form.statusChanges
        .subscribe(res => this.disabled = (res !== 'VALID'));
    }
  }

  saveChanges() {
    if (this.avatar) {
      this._subscriptions.push(this._userService.save(this.currentUser)
        .flatMap(() => {
          const formModel = this.prepareSave(this.currentUser.id);
          return this._fileService.uploadAvatar(this.currentUser.id, formModel);
        }).subscribe(() => {
          this.doIfSuccess();
        }, err => {
          this.doIfFailed(err);
        }));
    } else {
      this._subscriptions.push(this._userService.save(this.currentUser)
        .subscribe(() => {
          this.doIfSuccess();
        }, err => {
          this.doIfFailed(err);
        }));
    }
  }

  doIfSuccess() {
    this._router.navigate(['/user']);
  }

  doIfFailed(err) {
    this.disabled = false;
    this._saveFailed = true;
    console.warn(err);
    this.error = 'Hiba az adatok mentése során. Kérjük, próbáld újra.';
  }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.avatar = null;
  }

  clearPicUrl() {
    this.currentUser.picUrl = '';
  }

  clearError() {
    delete(this.error);
    delete(this.errorDel);
  }

  show(reason) {
    this._loginModalSubscription = this._modalService.onHide.subscribe(() => {
      console.log(this.modalRefLogin.content.authFailed);
      if (this.modalRefLogin.content.authFailed) {
        this._saveFailed = true;
        this.disabled = false;
        if (reason === 'email') {
          this.error = 'Az adatokat a hibás autentikáció miatt nem mentettük.' +
            ' Kérjük, próbáld újra.';
        } else {
          this.errorDel = 'Az azonosítás nem sikerült, ezért a profilt nem töröltük.' +
            ' Kérjük, próbáld újra.';
        }
      } else {
        if (reason === 'email') {
          this._subscriptions.push(this._userService.changeEmail(this.currentUser.email)
            .subscribe(() => this.saveChanges(), error => {
              this.error = 'Hiba történt az email mentése során. Kérjük,' +
                ' próbáld újra.';
              console.warn(error);
            }));
        } else {
          this._subscriptions.push(this._userService.deleteProfile()
            .subscribe((res) => {
              console.log(res);
              this.successDel = 'Profilodat töröltük.';
            }, error => {
              this.errorDel = 'Hiba történt a profil törlése során. Kérjük,' +
                ' próbáld újra.';
              console.warn(error);
            }));
        }

      }
      this._loginModalSubscription.unsubscribe();
      return this._changeDetection.markForCheck();
    });
    const text = reason === 'email' ? 'Az e-mail cím megváltoztatásához' : 'Profilod törléséhez';
    const initialState = {
      modalTitle: 'Belépési adatok',
      text: `${text} kérjük, erősítsd meg, hogy tényleg Te vagy:`,
      needRememberMe: false,
      needEmail: false,
      closeBtnName: 'Mehet',
      isReAuth: true
    };
    this.modalRefLogin = this._modalService.show(LoginModalComponent);
    Object.assign(this.modalRefLogin.content, initialState);
  }

  changePassword() {
    this.modalRefPassword = this._modalService.show(ChangePasswordComponent);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRefDelete = this._modalService.show(template);
  }

  deleteProfile() {
    this.show('deleteProfile');
  }

  private prepareSave(id): FormData {
    const input = new FormData();
    input.append('id', id);
    input.append('avatar', this.form.get('avatar').value);
    return input;
  }
}

