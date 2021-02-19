import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DOCUMENT} from '@angular/common';
import {User} from '../../Models/User';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  request: any = {
    'name': '',
    'gender': '',
    'email': '',
    'telNumber': '',
    'country': '',
    'address': '',
    'postalCode': '',
    'city': '',
  };
  selectedFiles: File[] = [];
  message = '';
  @ViewChild('myFileInput') myFileInput;
  imagee: string = '';

  constructor(@Inject(DOCUMENT) private document: Document, private apiService: ApiService, private router: Router, private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.show();
  }

  openInput() {
    document.getElementById('fileInput').click();
  }

  updateUser(request) {
    this.apiService.updateUser(request).subscribe(
      res => {
        if (res === 'Logout') {
          this.apiService.logout();
          this.router.navigate(['/login']).then((navigated: boolean) => {
            if (navigated) {
              this.apiService.successSnackBar('Please confirm email change, by clicking link we have sent to your email address!!');
            }
          });
        } else if (res == 'Successfully updated!') {
          this.show();
          this.apiService.successSnackBar('Sucessfully updated!');
        }
      }
    );
  }

  upload() {
    if (this.selectedFiles[0]) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFiles[0]);

      this.apiService.upload(formData).subscribe(
        event => {
          this.show();
          this.apiService.successSnackBar('Sucessfully updloaded photo');
        });
    }
    this.selectedFiles = undefined;
    this.myFileInput.nativeElement.value = '';
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  show() {
    this.apiService.retrieveUserInfo().subscribe(
      res => {
        this.apiService.editUser(res);
        this.apiService.editCart(res.cart);
        if (res) {
          this.request.email = res.email;
          this.request.name = res.name;
          this.request.gender = res.gender;
          this.request.telNumber = res.telNumber;
          this.request.country = res.country;
          this.request.postalCode = res.postalCode;
          this.request.address = res.address;
          this.request.city = res.city;
          if (res.image != undefined) {
            this.imagee = environment.baseUrl+'api/image/' + res.image;
          }
        }
      }
    );
  }

}
