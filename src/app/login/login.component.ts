import {Component, Injectable, OnInit} from '@angular/core';
import {ApiService} from '../Service/api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogloginComponent} from './dialoglogin/dialoglogin.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Cart, Role, User} from '../Models/User';
import {ChangePasswordComponent} from './change-password/change-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  authRequest: any = {
    'email': '',
    'password': ''
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService, private matSnackBar: MatSnackBar, private matDialog: MatDialog, private router: Router) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['scsrg']==="true"){
        this.apiService.successSnackBar("Successfully registered!");
      }else if (params['scschngpassword']==="true"){
        this.apiService.successSnackBar("Successfully changed password!");
      } else if (params['scschngmail']==="true"){
        this.apiService.successSnackBar("Successfully chanded email address!");
      } else if (params['scsrg']==="false"){
        this.apiService.errorSnackBar("Registration failed");
      }else if (params['scschngpassword']==="false"){
        this.apiService.errorSnackBar("Password change failed!");
      } else if (params['scschngmail']==="false"){
        this.apiService.errorSnackBar("Email change failed!");
      }
      this.removeQueryParams();
    });
  }

  removeQueryParams(){
    this.router.navigate([], {
      queryParams: {
        scsrg: null,
        scschngpassword:null,
        scschngmail:null,
      },
      queryParamsHandling: 'merge'
    });
  }

  login(request) {
    this.apiService.generateToken(request).subscribe(
      res => {
        if (res === 'Code has been generated!') {
          this.apiService.successSnackBar('Code has been generated!');
          this.openDIalog();
        } else if (res === 'Already generated!') {
          this.openDIalog();
        }else {
          localStorage.setItem('token', res);
          this.retrieveUserInfo();
          this.router.navigate(['']).then((navigated: boolean) => {
            if (navigated) {
              this.apiService.successSnackBar('Sucessfully logged in');
            }
          });
        }
      }, error => {
        if (error === 'Bad auth code!') {
          this.openDIalog();
          this.authRequest.twoPhCode =this.authRequest = {
            'email': this.authRequest.email,
            'password': this.authRequest.password
          };
        }
      }
    );
  }


  openDIalog() {
    this.matDialog.open(DialogloginComponent).afterClosed().subscribe(
      res => {
        if (res) {
          this.authRequest.twoPhCode = res;
          this.login(this.authRequest);
        }
      }
    );
  }

  openChangePasswordDialog() {
    this.matDialog.open(ChangePasswordComponent);
  }

  retrieveUserInfo() {
    this.apiService.retrieveUserInfo().subscribe(
      res => {
        this.apiService.editCart(res.cart);
        this.apiService.editUser(res);
      }
    );
  }
}
