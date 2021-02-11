import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Helper/PathConstants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangeForm: FormGroup;
  districtsData: any = [];
  regionsData: any = [];
  password: any;
  OldPassword: any;
  NewPassword: any;
  login_User: any;
  userName: any;

  constructor(private router: Router, private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    // this.login_User = JSON.parse(this.authService.getUserInfo()).user;
    this.login_User = JSON.parse(this.authService.getCredentials());
    this.ChangeForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required],
      Newpswd: ['', Validators.required]
    })
    this.userName = this.login_User.user;
  }

  onViewUserinfo(event, panel) {
    panel.toggle(event);
    this.login_User = JSON.parse(this.authService.getCredentials()).user;
    this.userName = this.login_User.user;
    // this.password = JSON.parse(this.authService.getCredentials()).pswd;
    // if(this.data !== undefined) {
    //  this.data.forEach(x => {
    //   this.godownName = x.GName;
    //   this.regionName = x.RName;
    //  });
    // }
  }

  // onForgetPswd() {
  //   if (this.ChangeForm.invalid) {
  //     this.messageService.clear();
  //     this.messageService.add({
  //       key: 't-err', severity: 'error',
  //       summary: 'Error Message', detail: 'Please Enter Valid Credentials!'
  //     });
  //     return;
  //   } else {
  //     const params = {
  //       'UserName': this.userName,
  //       'Pswd': this.password
  //     }
  //     this.restApiService.getByParameters(PathConstants.ChangePassword, params).subscribe(res => {
  //       if (res !== undefined) {
  //         if (this.userName.toLowerCase() === res[0].userName.toLowerCase() && this.OldPassword === res[0].Pwd && this.OldPassword !== this.NewPassword) {
  //           this.router.navigate(['Home']);
  //           this.setUsername(this.userName);
  //           this.setOldPassword(this.OldPassword);
  //           this.setNewPassword(this.NewPassword);
  //         }
  //       } else {
  //         this.onClear();
  //         this.messageService.clear();
  //         this.messageService.add({
  //           key: 't-err', severity: 'error',
  //           summary: 'Error Message', detail: 'Please Enter Valid Credentials!'
  //         });
  //       }
  //     });
  //   }
  // }

  onNew() {
    let head = JSON.parse(this.authService.getCredentials()).pswd;
    const params = {
      'UserId': this.login_User.Id,
      'Pswd': this.NewPassword
    };
    if (this.OldPassword === head && this.NewPassword !== undefined && this.NewPassword !== null && this.NewPassword !== this.OldPassword) {
      this.restApiService.put(PathConstants.ChangePassword, params).subscribe(res => {
        if (res) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Password Changed Successfully!'
          });
          // setTimeout(this.onTime, 3000);
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: 'Please contact Administrator'
          });
        }
      });
      // this.router.navigate(['login']);
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: 'error',
        summary: 'Error Message', detail: 'Password does not Match!!!'
      });
    }
    this.onClear();
    // this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: 'Error Message', detail: 'Please try again!' });
  }

  onClear() {
    this.OldPassword = this.NewPassword = '';
  }

  onClose() {
    this.messageService.clear('t-err');
  }

  onTime() {
    this.router.navigate(['login']);
  }

  setUsername(username) {
    this.userName = username;
  }

  getUsername() {
    return this.userName;
  }

  setOldPassword(OldPassword) {
    this.OldPassword = OldPassword;
  }

  getOldPassword() {
    return this.OldPassword;
  }

  setNewPassword(NewPassword) {
    this.NewPassword = NewPassword;
  }

  getNewPassword() {
    return this.NewPassword;
  }

  onLogOut() {
    this.authService.logout();
  }
}
