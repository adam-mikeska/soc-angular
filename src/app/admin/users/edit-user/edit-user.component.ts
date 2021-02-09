import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../Service/api.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  request: any = {
    'name': this.data.name,
    'email': this.data.email,
    'telNumber': this.data.telNumber,
    'country': this.data.country,
    'address': this.data.address,
    'postalCode': this.data.postalCode,
    'city': this.data.city,
    'gender': this.data.gender,
    'publicInfo': this.data.publicInfo,
  };
  disabled: boolean = this.data.image.includes('img_avatar_female.png') || this.data.image.includes('img_avatar_male.png');
  selected = '';
  apiUrl=environment.baseUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private router: Router, private matDialogRef: MatDialogRef<EditUserComponent>) {
  }


  ngOnInit(): void {

  }

  changeImage(){
    this.apiService.changeImage(this.data.id).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
        this.matDialogRef.close(res);
      }
    )
  }

  adminUpdateUser(request) {
    this.apiService.adminUpdateUser(this.data.id, request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.matDialogRef.close(res);
      }
    );
  }
}
