import {AfterViewInit, Component, NgZone, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeHtml, Title} from '@angular/platform-browser';
import {ApiService} from '../Service/api.service';
import {ProductOption} from '../Models/Product';
import {Image} from '@ks89/angular-modal-gallery';
import {NgForm} from '@angular/forms';
import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

type AnimationState = 'animationStarted' | 'none';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [
    trigger('changeRoute', [
      transition('* => animationStarted', [
        animate('1s', keyframes([
          style({transform: 'scale(1)',}),
          style({transform: 'scale(1.1)'}),
          style({transform: 'scale(1)'})
        ]))
      ]),
      transition(':enter', [
        animate('1s', keyframes([
          style({transform: 'scale(1)',}),
          style({transform: 'scale(1.1)'}),
          style({transform: 'scale(1)'})
        ]))
      ]),
    ])
  ],
})
export class ProductComponent implements OnInit {
  animationState$ = new BehaviorSubject<AnimationState>('none');

  private lastClickedRoute;
  productOption: ProductOption;
  sameProductOptions: ProductOption[];
  product: string;
  option: string;

  cartItem: any = {
    'product': '',
    'underTitle': '',
    'size': '',
    'quantity': ''
  };

  category: any[];
  desc: SafeHtml;
  notOnStock = false;
  isLoaded = false;
  @ViewChild('f', {static: true}) noteForm: NgForm;
  imagesRect: Image[] = [];
  apiUrl=environment.baseUrl;

  constructor(private route: ActivatedRoute, private router: Router, private titleService: Title, private apiService: ApiService, private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.notOnStock = false;
      this.isLoaded = false;
      this.findAllProductOptions();
      if (this.noteForm) {
        this.noteForm.resetForm();
      }
      if (this.lastClickedRoute !== this.route) {
        this.animationState$.next('animationStarted');
        this.lastClickedRoute = this.route;
      }
    });
  }

  animationDoneHandler(): void {
    if (this.lastClickedRoute) {
      this.animationState$.next('none');
    }
  }


  findAllProductOptions() {
    this.product = this.route.snapshot.paramMap.get('title');
    this.option = this.route.snapshot.paramMap.get('option');
    this.lastClickedRoute = this.product + '/' + this.option;
    this.cartItem.product = this.product;
    this.cartItem.underTitle = this.option;
    this.imagesRect = [];

    this.apiService.findAllProductOptions(this.product, this.option).subscribe(
      res => {
        this.productOption = res[0];

        //CATEGORY BREADCRUMB//
        let category = this.productOption.product.category;
        this.category = [];
        while (category !== null) {
          this.category.push(category.name);
          category = category.parent;
        }
        this.category.push("")
        this.category=this.category.reverse();

        //SORT SIZES//

        this.titleService.setTitle((res[0].product.brand === null ? '' : res[0].product.brand.name + ' ') + this.product + '-' + this.option + ' | E-SNEAKERS');
        res[0].productSizes.sort(function(a, b) {
          return a.size > b.size ? 1 : a.size < b.size ? -1 : 0;
        });

        //CHECK IF IS ON STOCK//

        this.sameProductOptions = res;
        let x = 0;
        for (let e = 0; e < res[0].productSizes.length; e++) {
          if (res[0].productSizes[e].onStock < 1) {
            x++;
          }
        }
        if (x === res[0].productSizes.length) {
          this.notOnStock = true;
        }

        this.desc = this.domSanitizer.bypassSecurityTrustHtml(this.productOption.description.replace('<figure class="media">', '').replace('</figure>', ''));

        //IF IS ON STOCK - SELECT FIRST SIZE//

        if (!this.notOnStock) {
          for (let i = 0; i < res[0].productSizes.length; i++) {
            if (res[0].productSizes[i].onStock > 0) {
              this.cartItem.size = res[0].productSizes[i].size;
              break;
            }
          }
          this.cartItem.quantity = 1;
        }
        for (let i = 0; i < this.productOption.productImages.length; i++) {
          this.imagesRect = [...this.imagesRect,
            new Image(
              i,
              {
                img: environment.baseUrl+'products/image/' + this.productOption.product.title + '/' + this.productOption.underTitle + '/' + this.productOption.productImages[i].image,
              },
              {
                img: environment.baseUrl+'products/image/' + this.productOption.product.title + '/' + this.productOption.underTitle + '/' + this.productOption.productImages[i].image,
              }
            )];
        }
        if (this.imagesRect.length > 0) {
          this.isLoaded = true;
        }
      }, err => {
        if (err === 'Product not found!') {
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
      word += '/' + this.category[k];
    }
    return word;
  }

  addToCart() {
    this.apiService.addToCart(this.cartItem).subscribe(
      res => {
        this.router.navigate(['/cart']).then((navigated: boolean) => {
          if (navigated) {
            this.apiService.successSnackBar(res);
          }
        });
      }
    );
  }
}
