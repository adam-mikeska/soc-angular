import {Component, HostListener, OnInit} from '@angular/core';
import {ApiService} from '../Service/api.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {Cart, CartItem, Role, Order, User, Cart_OrderDelivery, Cart_OrderPayment, Coupon} from '../Models/User';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DialogloginComponent} from '../login/dialoglogin/dialoglogin.component';
import {LogoutDialogComponent} from './logout-dialog/logout-dialog.component';
import {Alert, Category, Delivery, Payment, product_category_autocomplete, ProductImage, ProductOption} from '../Models/Product';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {environment} from '../../environments/environment';
import {filter} from 'rxjs/operators';

declare var jQuery: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)', zIndex: '1'}),
        animate('500ms ease-in', style({transform: 'translateY(0%)', zIndex: '1'}))
      ])
    ]),
    trigger('widthGrow', [
      state('closed', style({
        width: 0,
      })),
      state('open', style({
        width: 200
      })),
      transition('* => *', animate(150))
    ]),
  ],

})

export class NavigationComponent implements OnInit {
  user: User;
  state = 'closed';
  isAdmin: boolean = false;
  loaded: boolean;
  search: string;

  changeState(): void {
    (this.state == 'closed') ? this.state = 'open' : this.state = 'closed';
  }

  totalItems: number = 0;
  totalPrice: number = 0;

  cart: Cart = new class implements Cart {
    cartItems: CartItem[];
    id: number;
    user: User;
    cart_orderDelivery: Cart_OrderDelivery;
    cart_orderPayment: Cart_OrderPayment;
    coupon: Coupon;
  };

  TREE_DATA: Category[];

  products_categories_autocomplete_var: product_category_autocomplete = new class implements product_category_autocomplete {
    categories: Category[];
    productOptions: ProductOption[];
  };
  alerts:Alert[]=[];
  apiUrl = environment.baseUrl;

  constructor(private apiService: ApiService, private matSnackBar: MatSnackBar, private matDialog: MatDialog, private router: Router,private activatedRoute:ActivatedRoute) {

    this.apiService.castCart.subscribe(
      res => {
        this.totalItems = 0;
        this.totalPrice = 0;
        this.cart = res;
        if (this.cart.cartItems) {
          this.totalItems = this.cart.cartItems.reduce((sum, current) => sum + current.quantity, 0);
          this.totalPrice = this.cart.cartItems.reduce((sum, current) => sum + (current.productOption.price - current.productOption.discount) * current.quantity, 0);
          if (this.cart.coupon) {
            if (this.cart.coupon.discountType === 'TOTAL') {
              this.totalPrice -= this.cart.coupon.discount;
            } else if (this.cart.coupon.discountType === 'PERCENTAGE') {
              this.totalPrice = (this.totalPrice / 100) * (100 - this.cart.coupon.discount);
            }
          }
        }
      }
    );

    this.apiService.cast.subscribe(user => {
      if (user) {
        this.isAdmin = user?.role?.permissions.includes('display_users') || user?.role?.permissions.includes('display_products') || user?.role?.permissions.includes('display_products') || user.role?.permissions.includes('display_orders') || user.role?.permissions.includes('display_roles') || user.role?.permissions.includes('display_brands') || user.role?.permissions.includes('display_categories') || user.role?.permissions.includes('display_coupons') || user.role?.permissions.includes('display_others') || user.role?.permissions.includes('*');
      }
      this.user = user;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.search = (this.activatedRoute.snapshot.queryParams['search'] ? this.activatedRoute.snapshot.queryParams['search'] : '');
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getAlerts();
  }

  getAlerts(){
    this.apiService.getAlerts().subscribe(
      res=>{
        this.alerts=res;
      }
    )
  }

  getCategories() {
    this.apiService.getCategories('').subscribe(
      res => {
        this.TREE_DATA = this.list_to_tree(res);
      }, error => {
        this.getCategories();
      }
    );
  }

  decode(string) {
    return decodeURI(string);
  }

  list_to_tree(list) {
    var map = {}, node: Category, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i;
      list[i].children = [];
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent) {
        list[map[node.parent.id]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  isLoaded() {
    this.loaded = true;
  }

  openDIalog() {
    this.matDialog.open(LogoutDialogComponent).afterClosed().subscribe();
  }

  isUserLoggedIn() {
    return this.apiService.isUserLoggedIn();
  }

  update() {
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search && wordSearch.length > 1) {
        this.products_categories_autocomplete(this.search);
      } else if (wordSearch.length < 2) {
        this.products_categories_autocomplete_var = new class implements product_category_autocomplete {
          categories: Category[];
          productOptions: ProductOption[];
        };
      }
    }, 500);
  }

  products_categories_autocomplete(search) {
    this.apiService.autocompleteProductsAndCategories(search).subscribe(
      res => {
        this.products_categories_autocomplete_var = res;
      }
    );
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

  route(newRoute) {
    this.router.navigate([newRoute]);
    this.changeState();
    this.products_categories_autocomplete_var = new class implements product_category_autocomplete {
      categories: Category[];
      productOptions: ProductOption[];
    };
  }

  routeToSearch() {
    this.router.navigate(['/search'], {queryParams: {search: this.search}});
    this.changeState();
    this.products_categories_autocomplete_var = new class implements product_category_autocomplete {
      categories: Category[];
      productOptions: ProductOption[];
    };
  }

  closeButton(alert){
    sessionStorage.setItem("blocked_alerts",(sessionStorage.getItem("blocked_alerts") ? sessionStorage.getItem("blocked_alerts")+","+alert.id : alert.id));
  }

  isBlocked(alert){
    return sessionStorage.getItem("blocked_alerts") && sessionStorage.getItem("blocked_alerts").includes(alert.id);
  }

}
