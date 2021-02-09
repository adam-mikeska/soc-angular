import {ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as Editor from 'CKeditor/build/ckeditor';
import {User} from '../../../Models/User';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {ApiService} from '../../../Service/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  @ViewChild('myFileInput') myFileInput;
  selectable = true;
  removable = true;
  addOnBlur = true;
  arr: string[] = this.data.selected;
  filteredUsers: string[];
  userCtrl = new FormControl();
  selectedFiles: File[] = [];
  request: any = {
    'address': this.arr,
    'subject': '',
    'content': 'Message'
  };

  editorConfig = this.apiService.editorConfig;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  public Editor = Editor;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private router: Router, private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<SendEmailComponent>) {

  }


  ngOnInit(): void {

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

  allEmails(){
    this.apiService.getEmails("").subscribe(
      res=>{
        this.request.address=res;
        this.arr=res;
      }
    )
  }

  selectFiles(event) {
    for(let i=0;i<event.target.files.length;i++){
      this.selectedFiles.push(event.target.files[i]);
    }
    this.myFileInput.nativeElement.value = '';
  }

  public sendEmail() {
    const formData = new FormData();
    formData.append('address', this.request.address);
    formData.append('subject', this.request.subject);
    formData.append('content', this.request.content);
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('attachments', this.selectedFiles[i]);
      }
    }
    var activeButton = document.activeElement.id;
    if (activeButton == 'sendMail') {
      this.apiService.sendEmail(formData).subscribe(res => {
          this.apiService.successSnackBar(res);
          this.dialogRef.close();
        this.selectedFiles= [];
        }
      );
    }
  }

  removeSelectedFile(index) {
    this.selectedFiles.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.arr.includes(event.option.viewValue)) {
      this.arr.push(event.option.viewValue);
    } else {
      this.apiService.errorSnackBar('Already selected');
    }
    this.userCtrl.setValue(null);
  }
  onReady(event){
    return this.apiService.onReady(event);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (this.validateEmail(event.value) && !this.arr.includes(value.trim())) {
        this.arr.push(value.trim());
      }
    }

    this.request.address = this.arr;
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

