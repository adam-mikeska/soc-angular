import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import Stripe from 'stripe';
import Orders = Stripe.resources.Orders;
import {MatTableDataSource} from '@angular/material/table';
import {Order} from '../../Models/User';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {ViewUserComponent} from '../../admin/users/view-user/view-user.component';
import {MatDialog} from '@angular/material/dialog';
import {OrderDetailsComponent} from '../../admin/orders/order-details/order-details.component';
import {UserOrderDetailsComponent} from './user-order-details/user-order-details.component';
import {CancelOrderComponent} from './cancel-order/cancel-order.component';

@Component({
  selector: 'app-users-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  dataSource = new MatTableDataSource<Order>();
  displayedColumns: string[] = ['id', 'payment', 'orderState', 'created', 'totalPrice'];
  total;
  usr;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private apiService: ApiService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res => {
        this.usr = res;
      }
    );
    this.getUsersOrders(0, 5);
  }

  nextPage() {
    this.getUsersOrders(this.paginator.pageIndex, this.paginator.pageSize);
  }

  getUsersOrders(page, size) {
    this.apiService.getUsersOrder(page, size).subscribe(
      res => {
        this.total = res['totalElements'];
        this.dataSource.data = res['content'];
      }
    );
  }

  openDialogViewOrder(row) {
    this.matDialog.open(UserOrderDetailsComponent, {data: row, width: '1000px'}).afterClosed().subscribe();
  }
  openDialogCancelOrder(row) {
    this.matDialog.open(CancelOrderComponent, {data: row,  width: '450px'}).afterClosed().subscribe(res=>{
      if(res){
        this.getUsersOrders(this.paginator.pageIndex, this.paginator.pageSize);
      }
    });
  }
}
