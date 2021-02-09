import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Order, User} from '../../../Models/User';
import {ApiService} from '../../../Service/api.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {OrderDetailsComponent} from '../../orders/order-details/order-details.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ViewUserComponent implements OnInit {
  dataSource = new MatTableDataSource<Order>();
  displayedColumns: string[] = ['id', 'payment', 'orderState', 'created', 'totalPrice'];
  total;
  usr:User;
  apiUrl=environment.baseUrl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, private router: Router, private dialogRef: MatDialogRef<ViewUserComponent>, private matDialog: MatDialog) {
  }
  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        this.usr=res;
      }
    )
    this.getUsersOrders(this.data.id,0,5);
  }

  nextPage() {
    this.getUsersOrders(this.data.email,this.paginator.pageIndex, this.paginator.pageSize);
  }

  openDialogViewOrder(row) {
    this.matDialog.open(OrderDetailsComponent, {data: row, width: '1000px'}).afterClosed().subscribe(
      res => {
      }
    );
  }

  getUsersOrders(id,page, size){
    this.apiService.getUsersOrders(id,page, size).subscribe(
      res=>{
        this.total = res['totalElements'];
        this.dataSource.data = res['content'];
      }
    )
  }
}
