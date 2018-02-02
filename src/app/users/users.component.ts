import { Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  form: FormGroup;
  loading = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private _fb: FormBuilder,
              private _http: HttpClient) {
    this.createForm();
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
