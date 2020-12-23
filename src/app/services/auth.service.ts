import { Injectable } from '@angular/core';
//import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean;
  getUserInfo: any;
  constructor(private router: Router) { }

  public isLoggedIn() {
    return true;
  }

  public loginInfo(userInfo: User) {
    if (userInfo !== undefined) {
      this.isSignedIn = true;
      JSON.stringify(localStorage.setItem('USER_INFO', JSON.stringify(userInfo)));
    }
  }

  public getLoggedUser() {
    return JSON.parse(localStorage.getItem('USER_INFO'));
  }

  public getUserAccessible() {
    // let roleId = localStorage.getItem('ID');
    let gCode = localStorage.getItem('GCODE');
    let rCode = localStorage.getItem('RCODE');
    let gName = localStorage.getItem('GNAME');
    let rName = localStorage.getItem('RNAME');

    if (gCode !== undefined && gCode !== ''
      && rCode !== undefined && rCode !== '') {
      return { gCode, rCode, gName, rName };
    }
  }

  public getCredentials() {
    this.getUserInfo = localStorage.getItem('USER_INFO');
     return this.getUserInfo;
   }

  public logout() {
    localStorage.removeItem('USER_INFO');
    this.router.navigateByUrl('');
  }
}
