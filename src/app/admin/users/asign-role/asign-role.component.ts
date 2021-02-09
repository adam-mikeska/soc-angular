import {Component, Inject, OnInit} from '@angular/core';
import {ApiService} from '../../../Service/api.service';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import {Role} from '../../../Models/User';
import {Router} from '@angular/router';

@Component({
  selector: 'app-asign-role',
  templateUrl: './asign-role.component.html',
  styleUrls: ['./asign-role.component.css']
})
export class AsignRoleComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  arr: string[] = this.data.selected;
  filteredUsers: string[];
  userCtrl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  request: any = {
    'users': this.arr,
    'roleName': ''
  };
  roles: string[];
  isChecked;
  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public data: any,private matDialogRef: MatDialogRef<AsignRoleComponent>,private router: Router) {
  }

  ngOnInit(): void {
    this.getRoles();
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

  asignRole(request) {
    this.apiService.asignRole(request).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.matDialogRef.close(res);
      });
  }

  getRoles(){
    this.apiService.getRolesNames().subscribe(
      res=>{
        this.roles=res;
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
  onChange(event: any)
  {
    this.isChecked = !this.isChecked;
    if(this.request.roleName===""){
      this.request.roleName = event.source.value;
    }else {
      this.request.roleName = "";
    }

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
