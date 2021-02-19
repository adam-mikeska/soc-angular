import {Delivery, Payment, Product, ProductOption, ProductSize} from './Product';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  postalCode: string;
  address: string;
  country : string;
  city : string;
  telNumber: string;
  registrationDate: string;
  gender: string;
  image: string;
  lockedTill: string;
  nonLocked: boolean;
  enabled: boolean;
  twoPhVerEnabled: boolean;
  cart: Cart;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  permissions: string;
  color: string;
}
export interface Cart {
  id: number;
  cartItems: CartItem[];
  user: User;
  cart_orderDelivery:Cart_OrderDelivery;
  cart_orderPayment:Cart_OrderPayment;
  coupon:Coupon;
}
export interface CartItem {
  id: number;
  quantity: number;
  productOption: ProductOption;
  productSize:string;
  cart: Cart;
}
export interface Order {
  id: number;
  name: string;
  email: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  telNumber: string;
  created: string;
  orderState: string;
  totalPrice: number;
  note:string;
  paymentDetails:string;
  cart_orderDelivery:Cart_OrderDelivery;
  cart_orderPayment:Cart_OrderPayment;
  coupon:Coupon;
  orderItems:OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productOption: ProductOption;
  productSize: string;
  order: Order;
}

export interface Cart_OrderDelivery {
  id: number;
  delivery: string;
  price: number;
  cartId: string;
  isOrdered: boolean;
}

export interface Cart_OrderPayment {
  id: number;
  payment: string;
  price: number;
  cartId: string;
  isOrdered: boolean;
}
export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount: number;
  discountType: string;
  enabled:boolean;
}
