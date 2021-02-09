import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-change2-fadialog',
  templateUrl: './change2-fadialog.component.html',
  styleUrls: ['./change2-fadialog.component.css']
})
export class Change2FADialogComponent implements OnInit {
  request2FA:string='';
  constructor(private matDialogRef:MatDialogRef<Change2FADialogComponent>) { }

  ngOnInit(): void {
  }

  close(){
    this.matDialogRef.close(this.request2FA)
  }


}
