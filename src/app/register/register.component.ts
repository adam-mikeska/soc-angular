import { Component, OnInit } from '@angular/core';
import {ApiService} from '../Service/api.service';
import {DialogloginComponent} from '../login/dialoglogin/dialoglogin.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  request: any = {
    "email":"",
    "name":"",
    "gender":"",
    "password":"",
    "repeatPassword":''
  }
  constructor(private apiService: ApiService, private matSnackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  register(request){
    this.apiService.register(request).subscribe(
      res=> {
        if(res==="Please confirm your email!"){
          this.apiService.successSnackBar("Please confirm your email!");
          this.router.navigate(['/login']);
        }
      }, error => {
        var err = JSON.parse(error.error);
        this.apiService.errorSnackBar(err.message);
      }
    )
  }

}
