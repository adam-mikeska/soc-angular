import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../Service/api.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-alert',
  templateUrl: './add-alert.component.html',
  styleUrls: ['./add-alert.component.css']
})
export class AddAlertComponent implements OnInit {

  request:any={
    'text':'',
    'color':''
  }

  constructor(private apiService:ApiService,private matDialogRef:MatDialogRef<AddAlertComponent>) { }

  ngOnInit(): void {
  }

  addAlert(request){
    this.apiService.addAlert(request).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
        this.matDialogRef.close(res);
      }
    )
  }

}
