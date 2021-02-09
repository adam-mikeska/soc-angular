import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ApiService} from '../Service/api.service';
import {Category, ProductOption} from '../Models/Product';
import {filter} from 'rxjs/operators';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  routes: string[];
  subCategories: Category[];
  link;
  products: ProductOption[];
  apiUrl = environment.baseUrl;
  params: any = {
    'sortBy': '',
    'direction': '',
    'page': '',
    'minimumPrice': '',
    'maximumPrice': ''
  };
  total;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private title: Title, private apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (this.router.url.startsWith('/category')) {
        try {
          this.params.sortBy = (this.activatedRoute.snapshot.queryParams['sortBy'] ? this.activatedRoute.snapshot.queryParams['sortBy'] : '');
          this.params.direction = (this.activatedRoute.snapshot.queryParams['direction'] ? this.activatedRoute.snapshot.queryParams['direction'] : '');
          this.params.page = this.activatedRoute.snapshot.queryParams['page'];
          this.params.minimumPrice = this.activatedRoute.snapshot.queryParams['priceMin'] ;
          this.params.maximumPrice = this.activatedRoute.snapshot.queryParams['priceMax'] ;

          this.checkForSortbyAndDirection();

          this.link = decodeURI((this.router.url.indexOf('?') === -1 ? this.router.url : this.router.url.substr(0, this.router.url.indexOf('?'))));
          this.routes = this.link.split('/').slice(2).map(word => (`${word.substring(0, 1).toUpperCase()}${word.substring(1)}`));

          if (this.link.includes(',') || this.routes.length === 0) {
            this.router.navigate(['/error']);
            return;
          }

          this.title.setTitle((this.routes.map(x => decodeURI(x)).join(' - ').split(' ').join(' ')) + ' | E-SNEAKERS');

          this.getCategoryProducts(this.routes, this.params.page,   this.params.minimumPrice,   this.params.maximumPrice, this.params.sortBy, this.params.direction);

          this.routes = [''].concat(this.routes);
        } catch (e) {
          this.router.navigate(['/error']);
        }
      }
    });
  }

  ngOnInit() {

  }

  getCategoryProducts(categories, page,priceMin,priceMax,sortBy,direction) {
    this.apiService.findCategory_Products(categories, page,priceMin,priceMax,sortBy,direction).subscribe(
      res => {
        this.subCategories = res.categories;
        this.products = res.productOptions['content'];
        this.total = res.productOptions['totalElements'];
      }, error => {
        if (error === 'Not found!') {
          this.router.navigate(['/error']);
        }
      }
    );
  }

  getBreadcrumbLink(i: number) {
    if (i === 0) {
      return '/';
    }
    let word = '/category';
    for (let k = 0; k <= i; k++) {
      word += '/' + this.routes[k];
    }
    return word;
  }

  setDirection() {
    this.params.direction = (this.params.direction === 'desc' ? '' : 'desc');
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {direction: (this.params.direction ? this.params.direction : null)},
        queryParamsHandling: 'merge',
      });
  }

  setSortBy() {
    console.log(this.params.maxPrice)
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {sortBy: (this.params.sortBy ? this.params.sortBy : null), direction: null},
        queryParamsHandling: 'merge',
      });
  }

  setMinPrice(){
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {priceMin: this.params.minimumPrice ? this.params.minimumPrice : null},
        queryParamsHandling: 'merge',
      });
  }

  setMaxPrice(){
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {priceMax: this.params.maximumPrice  ? this.params.maximumPrice : null},
        queryParamsHandling: 'merge',
      });
  }

  checkForSortbyAndDirection() {
    if (this.params.sortBy && this.params.sortBy.toLowerCase() !== 'price' && this.params.sortBy.toLowerCase() !== 'sold_times' && this.params.sortBy.toLowerCase() !== 'added_in_date') {
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: {sortBy: null},
          queryParamsHandling: 'merge',
        });
    }

    if (!this.params.sortBy && this.params.direction || this.params.direction && this.params.direction.toLowerCase() !== 'desc') {
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: {direction: null},
          queryParamsHandling: 'merge',
        });
    }
  }

  nextPage(event: PageEvent) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {page: this.paginator.pageIndex === 0 ? null : this.paginator.pageIndex},
        queryParamsHandling: 'merge',
      });
  }

}
