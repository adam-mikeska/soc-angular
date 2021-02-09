import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-dialoglogin',
  templateUrl: './dialoglogin.component.html',
  styleUrls: ['./dialoglogin.component.css']
})
export class DialogloginComponent implements OnInit {
  twoPhCode:string='';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private matDialogRef:MatDialogRef<DialogloginComponent>) {
  }

  ngOnInit(): void {
  }

  close(){
    this.matDialogRef.close(this.twoPhCode);
  }

}
