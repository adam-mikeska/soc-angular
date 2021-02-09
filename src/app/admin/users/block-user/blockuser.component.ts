import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import {ApiService} from '../../../Service/api.service';
import {User} from '../../../Models/User';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-blockuser',
  templateUrl: './blockuser.component.html',
  styleUrls: ['./blockuser.component.css']
})
export class BlockuserComponent implements OnInit {

  selectable = true;
  removable = true;
  addOnBlur = true;
  arr: string[] = this.data.selected;
  filteredUsers: string[];
  allUsers: string[];
  userCtrl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  request: any = {
    'users': this.arr,
    'lockTime': '',
    'timeUnit': ''
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private dialogRef: MatDialogRef<BlockuserComponent>, private router: Router) {

  }

  ngOnInit(): void {

  }

  allEmails(){
    this.apiService.getEmails("").subscribe(
      res=>{
        this.request.users=res;
        this.arr=res;
      }
    )
  }


  update() {
      let wordSearch = this.userCtrl.value;
      setTimeout(() => {
        if (wordSearch == this.userCtrl.value) {
          this.getEmails(this.userCtrl.value);
        }
      }, 300);
  }

  getEmails(email){
    this.apiService.getEmails(email).subscribe(
      res=>{
        this.filteredUsers=res;
      }
    )
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.arr.includes(event.option.viewValue)) {
      this.arr.push(event.option.viewValue);
    } else {
      this.apiService.errorSnackBar('Already selected');
    }
    this.userCtrl.setValue(null);
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (this.validateEmail(event.value) && !this.arr.includes(value.trim())) {
        this.arr.push(value.trim());
      }
    }

    this.request.users = this.arr;
    if (input) {
      input.value = '';
    }
  }

  lockUser(request) {
    this.apiService.lockUser(request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.dialogRef.close(request);
      }
    );
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  remove(user: string): void {
    const index = this.arr.indexOf(user);

    if (index >= 0) {
      this.arr.splice(index, 1);
    }
    this.getEmails("");
  }
}
