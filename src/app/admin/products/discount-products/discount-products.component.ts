 import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../Service/api.service';
import {MatDialogRef} from '@angular/material/dialog';
 import {Category} from '../../../Models/Product';

@Component({
  selector: 'app-discount-products',
  templateUrl: './discount-products.component.html',
  styleUrls: ['./discount-products.component.css']
})
export class DiscountProductsComponent implements OnInit {

  request :any = {
    'discountBy':'',
    'discount':'',
    'value':''
  }
  fnlCateg;

  filtered;
  constructor(private apiService:ApiService,private matDialogRef:MatDialogRef<DiscountProductsComponent>) { }

  ngOnInit(): void {
  }

  getBrands(brand) {
    this.apiService.getBrandsName(brand).subscribe(
      res => {
        this.filtered = res;
        if (res.length > 0) {
          if (this.request.value.toUpperCase() === this.filtered[0].toUpperCase() && this.filtered.length === 1) {
            this.request.value = this.filtered[0];
          }
        }
      }
    );
  }

  getProducts(product) {
    this.apiService.getProduct(product).subscribe(
      res => {
        this.filtered = res;
        if (res.length > 0) {
          if (this.request.value.toUpperCase() === this.filtered[0].title.toUpperCase() && this.filtered.length === 1) {
            this.request.value = this.filtered[0].title;
          }
        }
      }
    );
  }

  getCategories(category) {
    this.apiService.getCategories(category).subscribe(
      res => {
        this.filtered = res;
        if (res.length > 0) {
          if (this.request.value.toUpperCase() === this.filtered[0].name.toUpperCase() && this.filtered.length === 1) {
            this.request.value = this.wrd(this.filtered[0], this.filtered[0].name)
            this.fnlCateg = this.filtered[0].id;
          }
        }
      }
    );
  }

  discountProduct(request){
    if(request.discountBy==='Category'){
      request.value=this.fnlCateg;
    }
    this.apiService.discountProducts(request).subscribe(
      res=>{
        this.matDialogRef.close(res);
        this.apiService.successSnackBar(res);
      }
    )
  }

  update() {
    if(this.request.discountBy==='Brand'){
      this.updateBrands();
    }else if(this.request.discountBy==='Category'){
      this.updateCategories();
    }else if(this.request.discountBy==='Product'){
      this.updateProducts()
    }
  }

  updateProducts(){
    let wordSearch = this.request.value;
    setTimeout(() => {
      if (wordSearch == this.request.value) {
        this.getProducts(this.request.value);
      }
    }, 300);
  }

  updateBrands() {
    let wordSearch = this.request.value;
    setTimeout(() => {
      if (wordSearch == this.request.value) {
        this.getBrands(this.request.value);
      }
    }, 300);
  }

  updateCategories() {
    let wordSearch = this.request.value;
    setTimeout(() => {
      if (wordSearch == this.request.value) {

        this.getCategories(this.request.value);
      }
    }, 300);
  }

  wrd(category: Category, wrd) {
    if (!category.parent) {
      return wrd;
    } else {
      wrd += ' - ' + category.parent.name;
      return this.wrd(category.parent, wrd);
    }
  }

}
