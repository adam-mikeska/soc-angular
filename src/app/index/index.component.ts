import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../Service/api.service';

import {Router} from '@angular/router';
import {Brand, CarouselImage, Product, ProductOption} from '../Models/Product';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class IndexComponent implements OnInit,AfterViewInit  {

  apiUrl=this.apiService.baseUrl;
  carousel : CarouselImage[] = [];
  latestProducts: ProductOption[];
  discountedProducts: ProductOption[];
  mostPopularProducts :ProductOption[];

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngAfterViewInit() {

  }
  ngOnInit(): void {
    this.findLatestProducts();
    this.findDiscountedProducts();
    this.findMostPopularProducts();
    this.getCarousel();
  }

  findLatestProducts() {
    this.apiService.findLatestProducts().subscribe(
      res => {
        this.latestProducts=res;
      }
    );
  }

  findDiscountedProducts() {
    this.apiService.findDiscountedProducts().subscribe(
      res => {
        this.discountedProducts=res;
      }
    );
  }

  findMostPopularProducts() {
    this.apiService.findMostPopularProducts().subscribe(
      res => {
        this.mostPopularProducts=res;
      }
    );
  }

  getCarousel(){
    this.apiService.getCarousel().subscribe(
      res=>{
        this.carousel=res;
      }
    )
  }

}
