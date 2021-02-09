import {Component, OnInit, ViewChild} from '@angular/core';
import {Category, product_category_autocomplete, Product_CategoryDTO, ProductOption} from '../Models/Product';
import {environment} from '../../environments/environment';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {filter} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ApiService} from '../Service/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  categories:Category[];
  productOptions:ProductOption[];
  apiUrl = environment.baseUrl;
  params: any = {
    'sortBy': '',
    'direction': '',
    'page': '',
    'search':'',
    'minimumPrice': '',
    'maximumPrice': ''
  };
  total;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private title: Title, private apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (this.router.url.startsWith('/search')) {
        try {
          this.params.sortBy = (this.activatedRoute.snapshot.queryParams['sortBy'] ? this.activatedRoute.snapshot.queryParams['sortBy'] : '');
          this.params.direction = (this.activatedRoute.snapshot.queryParams['direction'] ? this.activatedRoute.snapshot.queryParams['direction'] : '');
          this.params.page = this.activatedRoute.snapshot.queryParams['page'];
          this.params.search = this.activatedRoute.snapshot.queryParams['search'];
          this.params.minimumPrice = this.activatedRoute.snapshot.queryParams['priceMin'];
          this.params.maximumPrice = this.activatedRoute.snapshot.queryParams['priceMax'];

          if (!this.params.search) {
            this.router.navigate(['/error']);
            return;
          }

          this.checkForSortbyAndDirection();
          this.getCategoryProducts(0, this.params.minimumPrice,this.params.maximumPrice, this.params.sortBy,this.params.direction,this.params.search);
        } catch (e) {
          this.router.navigate(['/error']);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  getCategoryProducts(page,priceMin,priceMax,sortBy,direction,search) {
    this.apiService.find_categories_and_products_by_keyword(page,priceMin,priceMax,sortBy,direction,search).subscribe(
      res=>{
        this.categories=res.categories;
        this.productOptions=res.productOptions['content'];
        this.total=res.productOptions['totalElements'];
      }
    )
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
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {sortBy: (this.params.sortBy ? this.params.sortBy : null), direction: null},
        queryParamsHandling: 'merge',
      });
  }

  checkForSortbyAndDirection() {
    if (this.params.sortBy && this.params.sortBy.toLowerCase() !== 'price' && this.params.sortBy.toLowerCase() !== 'soldtimes' && this.params.sortBy.toLowerCase() !== 'addedindate') {
    console.log(this.params.sortBy)
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

  getLink(category: Category) {
    let categories = [];
    let link = '/category';
    while (category != null) {
      categories.push(category);
      category = category.parent;
    }
    categories = categories.reverse();

    for (let k = 0; k < categories.length; k++) {
      link += '/' + categories[k].name;
    }

    return link;
  }

  wrd(category: Category, wrd) {
    if (!category.parent) {
      return wrd;
    } else {
      wrd += ' - ' + category.parent.name;
      return this.wrd(category.parent, wrd);
    }
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

}
