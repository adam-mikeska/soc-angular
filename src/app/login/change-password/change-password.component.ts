import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  request: any = {
    'email': ''
  };
  constructor(private apiService: ApiService, private matSnackBar: MatSnackBar, private matDialog: MatDialog) { }

  ngOnInit(): void {
  }
  requestChangePassword(request){
    this.apiService.changePasswordRequest(request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.matDialog.closeAll();
      }
    );
}
}
