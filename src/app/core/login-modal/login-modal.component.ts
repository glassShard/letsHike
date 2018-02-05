import {
  Component, EventEmitter, OnInit, Output,
  TemplateRef
} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';


@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  modalTitle: string;
  closeBtnName: string;
  rememberMe: boolean;
  text: string;
  @Output() submitted = new EventEmitter();

  constructor(public modalRef: BsModalRef) {
    console.log('from constructor: ', this.modalTitle);
  }

  ngOnInit() {
    console.log('from onInit: ', this.modalTitle);
  }

  onClick() {
    this.submitted.emit({value: 'most jöttem a componentből'});
    console.log(this.modalRef);
    this.modalRef.hide();
  }

  reLogin (value) {
    console.log(value);
  }
}
