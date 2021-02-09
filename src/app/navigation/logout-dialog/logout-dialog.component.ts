import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../Service/api.service';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.css']
})
export class LogoutDialogComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }
  logout(){
    this.apiService.logout();
  }

}
