import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DialogloginComponent} from '../../login/dialoglogin/dialoglogin.component';
import {Change2FADialogComponent} from './change2-fadialog/change2-fadialog.component';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  is2FAenabled: boolean;
  hide = true;
  @ViewChild('f', {static: true}) noteForm: NgForm;
  request: any = {
    'currentPassword': '',
    'newPassword': '',
    'repeatNewPassword': ''
  };

  request2FA: any = {};

  constructor(private apiService: ApiService, private router: Router, private matSnackBar: MatSnackBar, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.show();
  }

  refresh() {
    this.apiService.retrieveUserInfo().subscribe(
      res => {
        this.apiService.editUser(res);
        this.apiService.editCart(res.cart);
      }
    );
  }

  updatePassword(request) {
    this.apiService.updatePassword(request).subscribe(
      res => {
        this.noteForm.resetForm();
        this.apiService.successSnackBar('Password changed sucessfully');
      },
      error => {
        this.apiService.errorSnackBar(error);
      }
    );
  }

  show() {
    this.apiService.retrieveUserInfo().subscribe(
      res => {
        this.apiService.editUser(res);
        this.apiService.editCart(res.cart);
        this.is2FAenabled = res.twoPhVerEnabled;
      }
    );
  }

  update2FA(request) {
    this.apiService.update2FA(request).subscribe(
      res => {
        if (res === 'Code was sent to your email address!') {
          this.apiService.successSnackBar('Code has been sent to your email address!');
          this.openDIalog();
        }else if (res === 'Sucessfully updated 2FA.') {
          this.refresh();
          this.apiService.successSnackBar('Sucessfully updated security!');
        } else if (res === 'Code already generated!') {
          this.openDIalog();
        }
      },
      error => {
        if (error === 'Bad confirmation code!') {
          this.openDIalog();
          this.request2FA =  {};
        }
      }
    );
  }

  openDIalog() {
    this.matDialog.open(Change2FADialogComponent).afterClosed().subscribe(
      res => {
        if (res) {
          this.request2FA.twoFactorCode = res;
          this.update2FA(this.request2FA);
        } else {
          this.is2FAenabled = !this.is2FAenabled;
        }
      }
    );
  }
}
