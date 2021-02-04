import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PathConstants } from '../Helper/PathConstants';
import { RestAPIService } from '../services/restAPI.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginForm: FormGroup;
  pwdResetForm: FormGroup;
  isSubmitted: boolean;
  clickedReset: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPwdNoMatchErr: boolean;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router,
    private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit() {
    this.isSubmitted = false;
    this.clickedReset = false;
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required]
    });
    this.pwdResetForm = this.fb.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      confirmPwd: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    this.restApiService.getByParameters(PathConstants.LoginURL, { 'username': this.username }).subscribe(credentials => {
      if (credentials.length !== 0 && credentials !== null && credentials !== undefined) {
        if (this.username.toLowerCase().trim() === credentials[0].login_name.toLowerCase().trim() &&
          this.password.toLowerCase().trim() === credentials[0].userpwd.toLowerCase().trim()) {
          var obj = this.loginForm.value;
          obj['Id'] = credentials[0].userid;
          obj['RoleId'] = credentials[0].role_id;
          this.authService.loginInfo(obj);
          this.router.navigate(['/home']);
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: 'Please enter valid credentials!'
          });
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Invalid user!'
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please Contact Administrator!'
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please check your network connection!'
        });
      }
    });
  }

  onChangePassword() {

  }

  openPwdReset() {
    this.clickedReset = true;
  }

  onValidatePwd(value) {
    const pwd: string = value.toString();
    const npwd = this.newPassword;
    if (pwd !== null && pwd !== '' && npwd !== '' && npwd !== null) {
      if (pwd.length === npwd.length && pwd !== npwd) {
        this.showPwdNoMatchErr = true;
      } else if (pwd.length !== npwd.length) {
        this.showPwdNoMatchErr = true;
      } else {
        this.showPwdNoMatchErr = false;
      }

    }
  }

}


