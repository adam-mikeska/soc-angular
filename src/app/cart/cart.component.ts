import {Component, OnInit, ViewChild} from '@angular/core';
import {Cart, Cart_OrderDelivery, Cart_OrderPayment, CartItem, Coupon, User} from '../Models/User';
import {ApiService} from '../Service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatStepper} from '@angular/material/stepper';
import {Delivery, Payment} from '../Models/Product';
import {Form, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  totalPrice: number;

  cart: Cart = new class implements Cart {
    cartItems: CartItem[];
    id: number;
    user: User;
    cart_orderDelivery: Cart_OrderDelivery;
    cart_orderPayment: Cart_OrderPayment;
    coupon: Coupon;
  };

  step: number;

  payments: Payment[];
  deliveries: Delivery[];

  saveInfoForNextOrder: boolean = false;
  dap = {
    'name': '',
    'email': '',
    'address': '',
    'country': '',
    'city': '',
    'postalCode': '',
    'telNumber': '',
    'note': ''
  };

  coupon: string = '';
  crtusr: User;
  request: any = {};

  apiUrl=environment.baseUrl;

  @ViewChild('stepper') stepper: MatStepper;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getDeliveriesAndPayments();
    this.stepperChecker();
    this.refresh();
  }

  setCoupon(coupon) {
    this.apiService.setCoupon(coupon).subscribe(
      res => {
        this.apiService.successSnackBar(res);
        this.refresh();
      }
    );
  }

  selectDelivery(delivery: Delivery, e) {
    e.preventDefault();
    this.apiService.setDelivery(delivery.title).subscribe(
      res => {
        this.refresh();
      }
    );
  }

  selectPayment(payment: Payment, e) {
    e.preventDefault();
    this.apiService.setPayment(payment.title).subscribe(
      res => {
        this.refresh();
      }
    );
  }

  stepperChecker() {
    if (this.cart) {
      this.route.queryParams.subscribe(params => {
        this.step = parseInt(params['step']);

        setTimeout(() => {
          this.stepper.linear = false;
          if (this.step < 1 || this.step > 2 || isNaN(this.step)) {
            this.removeQueryParams();
          }
          if (!this.step) {
            this.stepper.selectedIndex = 0;
          }

          if (this.step === 1 && this.cart.cartItems.length > 0) {
            this.stepper.selectedIndex = 1;
          } else if (this.step === 1 && this.cart.cartItems.length < 1) {
            this.stepper.selectedIndex = 0;
            this.removeQueryParams();
          }

          if (this.step == 2 && this.cart.cart_orderDelivery && this.cart.cart_orderPayment && this.cart.cartItems.length > 0) {
            this.stepper.selectedIndex = 2;
          } else if (this.step == 2 && !this.cart.cart_orderDelivery && this.cart.cartItems.length < 1 || this.step == 2 && !this.cart.cart_orderPayment && this.cart.cartItems.length < 1 || this.step == 2 && !this.cart.cart_orderDelivery && !this.cart.cart_orderDelivery && this.cart.cartItems.length < 1) {
            this.stepper.selectedIndex = 0;
            this.removeQueryParams();
          } else if (this.step == 2 && !this.cart.cart_orderPayment && this.cart.cartItems.length > 0 || this.step == 2 && !this.cart.cart_orderPayment && this.cart.cartItems.length > 0) {
            this.stepper.selectedIndex = 1;
            this.router.navigate([], {
              queryParams: {
                step: 1,
              },
              queryParamsHandling: 'merge'
            });
          }

          this.stepper.linear = true;

        });
      });
    }
  }

  removeQueryParams() {
    this.router.navigate([], {
      queryParams: {
        step: null,
      },
      queryParamsHandling: 'merge'
    });
  }

  order() {
    this.apiService.order(this.dap,this.apiService.isUserLoggedIn() && this.saveInfoForNextOrder).subscribe(
      res => {
        this.router.navigate(['/checkout/' + res]);
        this.refresh();
        this.apiService.successSnackBar('Successfully ordered!');
      }, error => {
        if (error === 'Cart is empty!') {
          this.stepper.selectedIndex = 0;
          this.refresh();
          this.removeQueryParams();
        }
        if (error.includes('Not enough on stock!')) {
          this.stepper.selectedIndex = 0;
          this.removeQueryParams();
        }
      });
  }

  stepChanged(event, stepper) {
    stepper.selected.interacted = false;
  }

  refresh() {
    this.totalPrice = 0;
    if (this.apiService.isUserLoggedIn()) {
      this.apiService.retrieveUserInfo().subscribe(
        res => {
          this.dap.email = (!this.dap.email ? res.email : this.dap.email);
          this.dap.name = (!this.dap.name ? res.name : this.dap.name);
          this.dap.address = (!this.dap.address ? res.address : this.dap.address);
          this.dap.country = (!this.dap.country ? res.country : this.dap.country);
          this.dap.city = (!this.dap.city ? res.city : this.dap.city);
          this.dap.postalCode = (!this.dap.postalCode ? res.postalCode : this.dap.postalCode);
          this.dap.telNumber = (!this.dap.telNumber ? res.telNumber : this.dap.telNumber);

          if (res.cart.coupon) {
            this.coupon = res.cart.coupon.code;
          } else {
            this.coupon = '';
          }

          this.cart = res.cart;
          this.setTotalPrice();

          this.crtusr = res;

          this.apiService.editCart(res.cart);
          this.apiService.editUser(res);
        }
      );
    } else {
      this.apiService.getCart().subscribe(
        res => {

          if (res.coupon) {
            this.coupon = res.coupon.code;
          } else {
            this.coupon = '';
          }

          this.cart = res;
          this.setTotalPrice();
          this.apiService.editCart(res);
        }
      );
    }
  }

  getDeliveriesAndPayments() {
    this.apiService.getDeliveries().subscribe(
      res => {
        this.deliveries = res;
      }
    );
    this.apiService.getPayments().subscribe(
      res => {
        this.payments = res;
      }
    );
  }

  secondStepCheck() {
    if (this.apiService.isUserLoggedIn()) {
      this.apiService.retrieveUserInfo().subscribe(
        res => {
          this.cart = res.cart;
          this.apiService.editCart(res.cart);
          if (res.cart.cartItems.length > 0) {
            this.router.navigate(['/cart'], {queryParams: {step: 1}});
            this.stepper.next();
          }
        }
      );
    } else {
      this.apiService.getCart().subscribe(
        res => {
          this.cart = res;
          this.apiService.editCart(res);
          if (res.cartItems.length > 0) {
            this.router.navigate(['/cart'], {queryParams: {step: 1}});
            this.stepper.next();
          }
        }
      );
    }
  }

  thirdStepCheck() {
    if (this.apiService.isUserLoggedIn()) {
      this.apiService.retrieveUserInfo().subscribe(
        res => {
          this.cart = res.cart;
          this.apiService.editCart(res.cart);
          if (res.cart.cartItems.length > 0 && this.cart.cart_orderDelivery && this.cart.cart_orderPayment) {
            this.router.navigate(['/cart'], {queryParams: {step: 2}});
            this.stepper.next();
          } else if (res.cart.cartItems.length < 1) {
            this.removeQueryParams();
            this.stepper.selectedIndex = 0;
          }
        }
      );
    } else {
      this.apiService.getCart().subscribe(
        res => {
          this.cart = res;
          this.apiService.editCart(res);
          if (res.cartItems.length > 0 && this.cart.cart_orderDelivery && this.cart.cart_orderPayment) {
            this.router.navigate(['/cart'], {queryParams: {step: 2}});
            this.stepper.next();
          } else if (res.cartItems.length < 1) {
            this.removeQueryParams();
            this.stepper.selectedIndex = 0;
          }
        }
      );
    }
  }


  deleteCartItem(productName, option, size) {
    this.apiService.deleteCartItem(productName, option, size).subscribe(
      res => {
        this.refresh();
        this.apiService.successSnackBar(res);
      }, error => {
        if (error === 'Cart item is not present anymore!') {
          this.refresh();
        }
      }
    );
  }

  updateCartItem(productName, quantity, option, size) {
    this.apiService.updateCartItem(productName, quantity, option, size).subscribe(
      res => {
        this.refresh();
        this.apiService.successSnackBar(res);
      }, error => {
        if (error === 'Cart item is not present anymore!') {
          this.refresh();
        }
      }
    );
  }

  setTotalPrice() {
    this.totalPrice = this.cart.cartItems.reduce((sum, current) => sum + (current.productOption.price - current.productOption.discount) * current.quantity, 0);
    if (this.cart.coupon) {
      if (this.cart.coupon.discountType === 'TOTAL') {
        this.totalPrice -= this.cart.coupon.discount;
      } else if (this.cart.coupon.discountType === 'PERCENTAGE') {
        this.totalPrice = (this.totalPrice / 100) * (100 - this.cart.coupon.discount);
      }
    }
    this.totalPrice+=(this.cart.cart_orderPayment ? this.cart.cart_orderPayment.price : 0) + (this.cart.cart_orderDelivery ? this.cart.cart_orderDelivery.price : 0)
  }

  isUserLoggedIn(){
    return this.apiService.isUserLoggedIn();
  }
}
