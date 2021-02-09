import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Order, User} from '../../Models/User';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import {ApiService} from '../../Service/api.service';
import {EditUserComponent} from '../users/edit-user/edit-user.component';
import {MatDialog} from '@angular/material/dialog';
import {OrderDetailsComponent} from './order-details/order-details.component';
import {ManageOrderComponent} from './manage-order/manage-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  selection = new SelectionModel<Order>(true, []);
  displayedColumns: string[] = [ 'id', 'name','cart_orderPayment','totalPrice','created','orderState','actions'];
  dataSource = new MatTableDataSource<Order>();
  total: 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currUser: User;

  sortActive: string;
  sortDirection: SortDirection;
  search: string;

  constructor(private apiService: ApiService,private matDialog:MatDialog) { }


  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        this.currUser=res;
      }
    )
    this.getOrders(0,10,undefined,undefined,undefined);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  nextPage(event: PageEvent) {
    this.getOrders(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive,this.search);
  }

  update() {
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        this.paginator.pageIndex=0;
        this.getOrders(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
      }
    }, 500);
  }


  sortData(sort: Sort) {
    this.sortDirection=sort.direction;
    this.sortActive=sort.active;
    if(this.sortDirection===""){
      this.sortActive=undefined;
    }
    this.getOrders(this.paginator.pageIndex, this.paginator.pageSize,  this.sortDirection,this.sortActive,this.search);
  }

  getOrders(page, size,direction,sortBy,search) {
    this.apiService.getOrders(page,size,direction,sortBy,search).subscribe(
      data => {
        this.total = data['totalElements'];
        this.dataSource.data = data['content'];
      }
    );
  }

  openDialogViewOrder(row) {
    this.matDialog.open(OrderDetailsComponent, {data: row, width: '1000px'}).afterClosed().subscribe();
  }

  manageOrder(row) {
    this.matDialog.open(ManageOrderComponent, {data: row, width: '1000px'}).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getOrders(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
      }
    );
  }
}
