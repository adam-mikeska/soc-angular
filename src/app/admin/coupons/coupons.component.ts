import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../Service/api.service';
import {SelectionModel} from '@angular/cdk/collections';
import {Coupon, Order, User} from '../../Models/User';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import {OrderDetailsComponent} from '../orders/order-details/order-details.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateCouponComponent} from './create-coupon/create-coupon.component';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  selection = new SelectionModel<Coupon>(true, []);
  displayedColumns: string[] = [ 'id','code','discount','minCartPrice','isEnabled'];
  dataSource = new MatTableDataSource<Coupon>();
  total: 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currUser: User;

  sortActive: string;
  sortDirection: SortDirection;
  search: string;
  constructor(private apiService:ApiService,private matDialog:MatDialog) { }

  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        this.currUser=res;
      }
    )
    this.getCoupons(0,10,undefined,undefined,undefined);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCoupons(page,size,direction,sortBy,search){
    this.apiService.getCoupons(page,size,direction,sortBy,search).subscribe(
      res=>{
        this.total = res['totalElements'];
        this.dataSource.data = res['content'];
      }
    )
  }

  update() {
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        this.paginator.pageIndex=0;
        this.getCoupons(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
      }
    }, 500);
  }

  sortData(sort: Sort) {
    this.sortDirection=sort.direction;
    this.sortActive=sort.active;
    if(this.sortDirection===""){
      this.sortActive=undefined;
    }
    this.getCoupons(this.paginator.pageIndex, this.paginator.pageSize,  this.sortDirection,this.sortActive,this.search);
  }

  nextPage(event: PageEvent) {
    this.getCoupons(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive,this.search);
  }

  disableEnableSale(id){
    this.apiService.disableEnableSale(id).subscribe(
      res=>{
        this.apiService.successSnackBar(res);
      }
    )
  }

  openDialogCreateCoupon() {
    this.matDialog.open(CreateCouponComponent, {width: '400px'}).afterClosed().subscribe(
      res=>{
        if(res){
          this.getCoupons(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive,this.search);
        }
      }
    );
  }

}
