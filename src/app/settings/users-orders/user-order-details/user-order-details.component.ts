import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiService} from '../../../Service/api.service';
import {Order, OrderItem} from '../../../Models/User';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-user-order-details',
  templateUrl: './user-order-details.component.html',
  styleUrls: ['./user-order-details.component.css']
})
export class UserOrderDetailsComponent implements OnInit {
  order: Order;
  apiUrl=environment.baseUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService) { }

  ngOnInit(): void {
    this.order=this.data;
  }

}
