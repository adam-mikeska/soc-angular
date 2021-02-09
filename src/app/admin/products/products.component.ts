import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Order, User} from '../../Models/User';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort, SortDirection} from '@angular/material/sort';
import {ApiService} from '../../Service/api.service';
import {MatDialog} from '@angular/material/dialog';
import {Product, ProductOption} from '../../Models/Product';
import {AddProductComponent} from './add-product/add-product.component';
import {EditProductComponent} from './edit-product/edit-product.component';
import {DiscountProductsComponent} from './discount-products/discount-products.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  selection = new SelectionModel<ProductOption>(true, []);
  displayedColumns: string[] = [ 'id','title','brand','price','soldTimes','actions'];
  dataSource = new MatTableDataSource<ProductOption>();
  total: 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currUser: User;

  sortActive: string;
  sortDirection: SortDirection;
  search: string;
  apiUrl=environment.baseUrl;

  constructor(private apiService: ApiService,private matDialog:MatDialog) { }

  ngOnInit(): void {
    this.apiService.cast.subscribe(
      res=>{
        this.currUser=res;
      }
    )
    this.getProducts(0,10,undefined,undefined,undefined);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  nextPage(event: PageEvent) {
    this.getProducts(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive,this.search);
  }

  update() {
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        this.paginator.pageIndex=0;
        this.getProducts(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
      }
    }, 500);
  }


  sortData(sort: Sort) {
    this.sortDirection=sort.direction;
    this.sortActive=sort.active;
    if(this.sortDirection===""){
      this.sortActive=undefined;
    }
    this.getProducts(this.paginator.pageIndex, this.paginator.pageSize,  this.sortDirection,this.sortActive,this.search);
  }

  getProducts(page, size,direction,sortBy,search) {
    this.apiService.getProducts(page,size,direction,sortBy,search).subscribe(
      data => {
        this.total = data['totalElements'];
        this.dataSource.data = data['content'];
      }
    );
  }

  createProduct() {
    this.matDialog.open(AddProductComponent, {
      width: '840px',
      autoFocus: false
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getProducts(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
      }
    );
  }

  editProductOption(id) {
    this.matDialog.open(EditProductComponent, {
      data: id,
      width: '840px'
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getProducts(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
      }
    );
  }

  discountProducts(){
    this.matDialog.open(DiscountProductsComponent, {
      width: '400px'
    }).afterClosed().subscribe(
      res => {
        if (res) {
          this.selection.clear();
          this.getProducts(this.paginator.pageIndex, this.paginator.pageSize, this.sortDirection, this.sortActive, this.search);
        }
      }
    );
  }
}
