import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {async} from '@angular/core/testing';
import {Order, OrderItem} from '../Models/User';
import {ApiService} from '../Service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

declare var paypal;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;
  order: Order;
  orderItems:OrderItem[];
  handler: StripeCheckoutHandler;
  id: number;
  paypal_order_id :number;
  checkou: any = {
    'stripeToken': ''
  };
  paidFor = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(() => {
      this.id = Number(parseInt(this.route.snapshot.paramMap.get('id')));
      this.getOrder(this.id);
    });
  }


  getOrder(id) {
    this.apiService.orderById(id).subscribe(
      res => {
        this.order = res;

        this.paidFor= res.orderState!=='AWAITING_PAYMENT' && res?.cart_orderPayment.payment==='Paypal';
        if (this.order?.cart_orderPayment.payment === 'Online_bank_payment' && this.order.orderState !== 'COMPLETED' && this.order.orderState !== 'PAID') {
          this.handler = StripeCheckout.configure({
            key: 'pk_test_51HOmSmCebk3j5nxBGfaSwWigFtnmfMlxyURzrg5GaV0t6G7tgvWWRNnDPMWlVlduJZG05MfiUUDptwzx8DN3cPrD00drgQa3jO',
            image: environment.baseUrl+'api/image/img_avatar_male.png',
            locale: 'auto',
            name: 'E-Commerce',

            token: token => {
              this.checkou.stripeToken = token.id;
              this.checkoutStripe(this.checkou, this.order.id);
            }
          });
        }
        if (this.order.cart_orderPayment.payment === 'Paypal' && this.order.orderState !== 'COMPLETED' && this.order.orderState !== 'PAID') {
          paypal
            .Buttons({
              style: {
                color:  'blue',
                shape:  'pill',
                label:  'pay',
                height: 40
              },
              createOrder: () => {
                return this.create_order_paypal(id).then(
                  res=>{
                    return res;
                  }
                );
              },
              onApprove: async (data) => {
                this.capture_order_paypal(id,data.orderID).then(
                  res=>{
                    this.apiService.successSnackBar("Successfully purchased!");
                    this.paidFor = true;
                    this.getOrder(id);
                  }
                )
              },
              onError: err => {
                this.apiService.errorSnackBar(err);
              }
            })
            .render(this.paypalElement.nativeElement);
        }

      }, error => {
        this.router.navigate(['/error']);
      }
    );

  }

  checkoutStripe(request, id) {
    this.apiService.checkoutStripe(request, id).subscribe(
      res => {
        this.getOrder(id);
        this.apiService.successSnackBar('Sucessfully purchased!');
      }
    );
  }

  async create_order_paypal(id) {
    return this.apiService.create_order_paypal(id).toPromise();
  }

  async capture_order_paypal(id,paypal_id) {
    return this.apiService.capture_order_paypal(id,paypal_id).toPromise();
  }

  async showCheckout() {
    this.handler.open({
      name: 'E-Commerce',
      description: "Order id: "+ this.order.id,
      amount: this.order.totalPrice * 100,
      currency: 'EUR'
    });

  }

}
