import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {EmailService} from '../../shared/email.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  @Input() emailModalTitle: string;
  @Input() recipientsEmail: string[];
  @Input() currentEmail: string;
  @Input() showEmailModal: boolean;
  @Input() subject: string;
  @Output() closeModal = new EventEmitter();
  public error: string = null;
  public success: string = null;
  public disabled = false;
  public sendEmail: FormGroup;
  public submitted = false;

  constructor(private _fb: FormBuilder,
              private _emailService: EmailService) {
  }

  ngOnInit() {
    this.sendEmail = this._fb.group(
      {
        message: ['', Validators.required],
        email: ['', Validators.compose([
          Validators.required,
          Validators.email
        ])]
      }
    );

    this.sendEmail.patchValue({
      email: this.currentEmail
    });
  }

  sendMail() {
    let setButton = new Subscription();
    this.clearError();
    this.submitted = true;
    console.log(this.sendEmail.valid);
    if (this.sendEmail.valid) {
      setButton.unsubscribe();
      const recipients = this.recipientsEmail.join();
      console.log(recipients);
      console.log(this.sendEmail.get('message').value);
      console.log(this.sendEmail.get('email').value);
      const input = new FormData();
      input.append('to', recipients);
      input.append('body', this.sendEmail.get('message').value);
      input.append('from', this.sendEmail.get('email').value);
      input.append('subject', this.subject);
      this._emailService.sendMail(input)
        .subscribe(res => {
          if (res.error) {
            this.error = res.error;
          } else {
            this.success = res.response;
          }
        });
    } else {
      setButton = this.sendEmail.statusChanges
        .subscribe(res => this.submitted = (res !== 'VALID'));
    }
  }

  clearError() {
    delete(this.error);
  }

  successClosed() {
    this.close();
  }

  close() {
    this.closeModal.emit();
  }
}
