import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Order, OrderItem} from '../../../Models/User';
import {ApiService} from '../../../Service/api.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
order: Order;
apiUrl=environment.baseUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService) {

  }
  ngOnInit(): void {
    this.order=this.data;
  }

}
