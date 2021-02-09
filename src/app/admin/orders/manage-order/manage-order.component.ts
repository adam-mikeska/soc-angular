import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../Service/api.service';
import {Order, OrderItem} from '../../../Models/User';

import {ConfirmUpdateOrderitemComponent} from './confirm-update-orderitem/confirm-update-orderitem.component';
import {ConfirmDeleteComponent} from '../../../confirm-delete/confirm-delete.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent implements OnInit,OnDestroy   {
  rez ;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private apiService:ApiService,private matDialogRef: MatDialogRef<ManageOrderComponent>,private matDialog:MatDialog) { }
  rdrstses= [
    "PROCESSING",
    "PAID",
    "AWAITING_PAYMENT",
    "SHIPPED",
    "COMPLETED",
    "REFUNDED",
    "CANCELED",
  ]
  currUser;
  rqst= {
    "name":this.data.name,
    "telNumber":this.data.telNumber,
    "email":this.data.email,
    "country":this.data.country,
    "city":this.data.city,
    "address":this.data.address,
    "postalCode":this.data.postalCode,
    "orderState":this.data.orderState
  }
  apiUrl=environment.baseUrl;
  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        this.currUser=res;
      }
    )
  }
  ngOnDestroy() {
    this.matDialogRef.close(this.rez);
  }

  updateOrder(request){
    this.apiService.updateOrder(request,this.data.id).subscribe(
      res=>{
        this.rez=res;
        this.apiService.successSnackBar(res);
      }
    )
  }

  getOrder(){
    this.apiService.orderByIdAdmin(this.data.id).subscribe(
      res=>{
        this.data=res;
      }
    );
  }

  openDialogConfirmUpdateOrderItem(orderItemId,quantity){
    this.matDialog.open(ConfirmUpdateOrderitemComponent, {
      data: {
        orderId:this.data.id,
        orderItemId:orderItemId,
        quantity:quantity
      },
      width: '500px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.rez=res;
          this.getOrder();
        }
      }
    );
  }

  openDialogConfirmDeleteOrderItem(orderItemId){
    this.matDialog.open(ConfirmDeleteComponent, {
      data: {
        case:'order item',
        orderId:this.data.id,
        orderItemId:orderItemId
      },
      width: '500px',
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.rez=res;
          this.getOrder();
        }
      }
    );
  }

}
