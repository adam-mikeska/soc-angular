import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Cart, Coupon, Order, Role, User} from '../Models/User';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  Alert,
  Brand,
  Carousel,
  Category,
  Delivery,
  Payment,
  Product,
  product_category_autocomplete,
  Product_CategoryDTO,
  ProductOption
} from '../Models/Product';
import Base64UploaderPlugin from '../../../CKeditor/Base64Upload';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ApiService {

  baseUrl: string = environment.baseUrl;

  private user : Subject<User> = new ReplaySubject<User>(1);

  editorConfig = {
    toolbar: {
      items: [
        'bold',
        'italic',
        'link',
        'ImageInsert',
        'MediaEmbed',
        '|',
        'indent',
        'outdent',
        'Alignment',
        '|',
        'blockQuote',
        'undo',
        'redo',
        'insertTable',
        'FontFamily',
        'FontSize',
        'Heading',
        'HorizontalLine',
        'bulletedList',
        'numberedList',
      ]
    },
    mediaEmbed: {
      previewsInData: true
    },
    image: {
      toolbar: [
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    extraPlugins: [Base64UploaderPlugin],
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'sk',
  };
  private cart :  Subject<Cart> = new ReplaySubject<Cart>(1);
  castCart = this.cart.asObservable();
  cast = this.user.asObservable();

  constructor(private httpClient: HttpClient, private router: Router, private matSnackBar: MatSnackBar) {
  }

  public editUser(newUser) {
    this.user.next(newUser);
  }

  public editCart(cart) {
    this.cart.next(cart);
  }

  //Cart service//

  public addToCart(request) {
    return this.httpClient.post(this.baseUrl + 'add-to-cart', request, {responseType: 'text' as 'json'});
  }

  public updateCartItem(productName, quantity, option, size) {
    let params = new HttpParams();
    params = params.set('product', productName);
    params = params.set('quantity', quantity);
    params = params.set('option', option);
    params = params.set('size', size);
    return this.httpClient.put(this.baseUrl + 'cart-item', params, {responseType: 'text' as 'json'});
  }

  public deleteCartItem(productName, option, size) {
    let params = new HttpParams();
    params = params.set('product', productName);
    params = params.set('option', option);
    params = params.set('size', size);
    return this.httpClient.delete(this.baseUrl + 'cart-item', {params: params, responseType: 'text' as 'json'});
  }

  getCart() {
    return this.httpClient.get<Cart>(this.baseUrl + 'cart', {responseType: 'json'});
  }

  setCoupon(coupon) {
    let params = new HttpParams();
    params = params.set('coupon', coupon);
    return this.httpClient.put<string>(this.baseUrl + 'coupon', params, {responseType: 'text' as 'json'});
  }

  //Roles//

  public updateRole(request, id) {
    return this.httpClient.put(this.baseUrl + `admin/roles/${id}`, request, {responseType: 'text' as 'json'});
  }

  public createCoupon(request) {
    return this.httpClient.post(this.baseUrl + 'admin/coupons', request, {responseType: 'text' as 'json'});
  }

  public asignRole(request): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + 'admin/users/asign-role', request, {responseType: 'text' as 'json'});
  }

  public getRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.baseUrl + 'admin/roles', {responseType: 'json' as 'json'});
  }

  public getRolesNames(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.baseUrl + 'admin/autocomplete/roles', {responseType: 'json' as 'json'});
  }

  public createRole(request) {
    return this.httpClient.post(this.baseUrl + 'admin/roles', request, {responseType: 'text' as 'json'});
  }

  public getUsersOrders(id, page, size) {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    return this.httpClient.get(this.baseUrl + `admin/users/${id}/orders`, {params: params, responseType: 'json' as 'json'});
  }

  public deleteRole(id: number) {
    return this.httpClient.delete(this.baseUrl + `admin/roles/${id}`, {responseType: 'text' as 'json'});
  }

  public deleteBrand(id: number) {
    return this.httpClient.delete(this.baseUrl + `admin/brands/${id}`, {responseType: 'text' as 'json'});
  }

  //Users service//

  upload(formData) {
    return this.httpClient.post(this.baseUrl + 'api/image', formData, {responseType: 'text' as 'json'});
  }

  public updateUser(request): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + 'api/update-informations', request, {responseType: 'text' as 'json'});
  }

  public changePasswordRequest(request): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + 'api/change-password-request', request, {responseType: 'text' as 'json'});
  }

  public updatePassword(request): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + 'api/update-password', request, {responseType: 'text' as 'json'});
  }

  public update2FA(request): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + 'api/2FA', request, {responseType: 'text' as 'json'});
  }

  public generateToken(request) {
    return this.httpClient.post<string>(this.baseUrl + 'api/authenticate', request, {responseType: 'text' as 'json'});
  }

  public register(request) {
    return this.httpClient.post<string>(this.baseUrl + 'api/register', request, {responseType: 'text' as 'json'});
  }

  public retrieveUserInfo(): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + 'api/user', {responseType: 'json' as 'json'});
  }

  public adminUpdateUser(id: number, request): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + `admin/users/${id}`, request, {responseType: 'text' as 'json'});
  }


  public changeImage(id: number): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + `admin/users/${id}/image`,{}, {responseType: 'text' as 'json'});
  }

  public sendEmail(request) {
    return this.httpClient.post(this.baseUrl + 'admin/send-email', request, {responseType: 'text' as 'json'});
  }

  public lockUser(request) {
    return this.httpClient.post(this.baseUrl + 'admin/users/lock', request, {responseType: 'text' as 'json'});
  }

  //Orders//

  public updateOrderItem(orderId,id, quantity) {
    let params = new HttpParams();
    params = params.set('quantity', quantity);
    return this.httpClient.put(this.baseUrl + `admin/orders/${orderId}/order-items/${id}`, params, {responseType: 'text' as 'json'});
  }

  public deleteOrderItem(orderId,id): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + `admin/orders/${orderId}/order-items/${id}`, { responseType: 'text' as 'json'});
  }

  public updateOrder(request, id): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + `admin/orders/${id}`, request, {responseType: 'text' as 'json'});
  }

  public order(request, shouldUpdate) {
    let params = new HttpParams();
    params = params.set('update', shouldUpdate);
    return this.httpClient.post<string>(this.baseUrl + 'order', request, {params: params, responseType: 'json' as 'json'});
  }

  public getOrders(page, size, direction, sortBy, search) {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (direction) {
      params = params.set('direction', direction);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.httpClient.get<Order[]>(this.baseUrl + 'admin/orders', {params: params, responseType: 'json'});
  }


  public checkoutStripe(request, orderId) {
    let params = new HttpParams();
    params = params.set('orderId', orderId);
    return this.httpClient.post(this.baseUrl + 'checkout/stripe', request, {params: params, responseType: 'text' as 'json'});
  }

  public create_order_paypal(orderId) {
    let params = new HttpParams();
    params = params.set('orderId', orderId);
    return this.httpClient.post<any>(this.baseUrl + 'checkout/paypal/create',params,{responseType: 'text' as 'json'});
  }

  public capture_order_paypal(orderId, paypalId) {
    let params = new HttpParams();
    params = params.set('orderId', orderId);
    params = params.set('paypalId', paypalId);
    return this.httpClient.get<any>(this.baseUrl + 'checkout/paypal/capture', {params: params, responseType: 'text' as 'json'});
  }

  public orderById(id) {
    return this.httpClient.get<Order>(this.baseUrl + `order/${id}`, {responseType: 'json' as 'json'});
  }

  public orderByIdAdmin(id) {
    return this.httpClient.get<Order>(this.baseUrl + `admin/orders/${id}`, {responseType: 'json' as 'json'});
  }

  //Autocomplete//

  public getEmails(email): Observable<string[]> {
    let params;
    if (email) {
      params = new HttpParams().set('email', email);
    }
    return this.httpClient.get<string[]>(this.baseUrl + 'admin/autocomplete/emails', {params: params, responseType: 'json' as 'json'});
  }

  public getBrandsName(brand): Observable<string[]> {
    let params;
    if (brand) {
      params = new HttpParams().set('brand', brand);
    }
    return this.httpClient.get<string[]>(this.baseUrl + 'admin/autocomplete/brands', {params: params, responseType: 'json' as 'json'});
  }

  public getProduct(product): Observable<Product[]> {
    let params;
    if (product) {
      params = new HttpParams().set('product', product);
    }
    return this.httpClient.get<Product[]>(this.baseUrl + 'admin/autocomplete/products', {params: params, responseType: 'json' as 'json'});
  }


  //Products//


  public discountProducts(request): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + 'admin/products/discount', request, {responseType: 'text' as 'json'});
  }

  public findLatestProducts(): Observable<ProductOption[]> {
    return this.httpClient.get<ProductOption[]>(this.baseUrl + 'products/latest', {responseType: 'json' as 'json'});
  }

  public findDiscountedProducts(): Observable<ProductOption[]> {
    return this.httpClient.get<ProductOption[]>(this.baseUrl + 'products/discounted', {responseType: 'json' as 'json'});
  }

  public findMostPopularProducts(): Observable<ProductOption[]> {
    return this.httpClient.get<ProductOption[]>(this.baseUrl + 'products/popular', {responseType: 'json' as 'json'});
  }

  public autocompleteProductsAndCategories(search): Observable<product_category_autocomplete> {
    let params = new HttpParams();
    if(search){
      params = params.set('search', search);
    }
    return this.httpClient.get<product_category_autocomplete>(this.baseUrl + 'products/autocomplete', {params,responseType: 'json' as 'json'});
  }


  public findCategory_Products(categories, page,priceMin,priceMax,sortBy,direction): Observable<Product_CategoryDTO> {
    let params = new HttpParams();
    if(page) {
      params = params.set('page', page);
    }
    if(sortBy){
      params = params.set('sortBy', sortBy);
    }
    if(direction){
      params = params.set('direction', direction);
    }
    if(priceMin){
      params = params.set('priceMin', priceMin);
    }
    if(priceMax){
      params = params.set('priceMax', priceMax);
    }
    return this.httpClient.get<Product_CategoryDTO>(this.baseUrl + `products/${categories}`, {
      params: params,
      responseType: 'json' as 'json'
    });
  }

  public find_categories_and_products_by_keyword(page,priceMin,priceMax,sortBy,direction,search): Observable<Product_CategoryDTO> {
    let params = new HttpParams();
    if(page) {
      params = params.set('page', page);
    }
    params = params.set('search', search);

    if(sortBy){
      params = params.set('sortBy', sortBy);
    }
    if(direction){
      params = params.set('direction', direction);
    }
    if(priceMin){
      params = params.set('priceMin', priceMin);
    }
    if(priceMax){
      params = params.set('priceMax', priceMax);
    }
    return this.httpClient.get<Product_CategoryDTO>(this.baseUrl +'products/search', {
      params: params,
      responseType: 'json' as 'json'
    });
  }

  public getPayments(): Observable<Payment[]> {
    return this.httpClient.get<Payment[]>(this.baseUrl + 'payments', {responseType: 'json' as 'json'});
  }

  public getDeliveries(): Observable<Delivery[]> {
    return this.httpClient.get<Delivery[]>(this.baseUrl + 'deliveries', {responseType: 'json' as 'json'});
  }

  public addProductSize(id,request) {
    return this.httpClient.post<string>(this.baseUrl + `admin/products/${id}/product-sizes`, request, {responseType: 'text' as 'json'});
  }

  public updateProductSize(productOptionId,id, request) {
    return this.httpClient.put<string>(this.baseUrl + `admin/products/${productOptionId}/product-sizes/${id}`, request, {responseType: 'text' as 'json'});
  }

  public deleteProductSize(productOptionId,id) {

    return this.httpClient.delete<string>(this.baseUrl + `admin/products/${productOptionId}/product-sizes/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  public updateProduct(id, request) {
    return this.httpClient.put<string>(this.baseUrl + `admin/products/${id}`, request, {responseType: 'jhs' as 'json'});
  }

  public getCategories(category): Observable<Category[]> {
    let params;
    if (category) {
      params = new HttpParams().set('category', category);
    }
    return this.httpClient.get<Category[]>(this.baseUrl + 'products/categories', {
      params: params,
      responseType: 'json' as 'json'
    });
  }

  public addCategory(request) {
    return this.httpClient.post<string>(this.baseUrl + 'admin/categories', request, {responseType: 'text' as 'json'});
  }

  public updateCategory(id,request) {
    return this.httpClient.put<string>(this.baseUrl + `admin/categories/${id}`, request, {responseType: 'text' as 'json'});
  }

  public deleteCategory(id) {
    return this.httpClient.delete(this.baseUrl + `admin/categories/${id}`, {responseType: 'text' as 'json'});
  }

  public getProductOption(title,underTitle) {
    return this.httpClient.get<ProductOption>(this.baseUrl + `admin/products/${title}/${underTitle}`, {
      responseType: 'json' as 'json'
    });
  }

  public uploadImageToProduct(id, images) {
    return this.httpClient.post<ProductOption>(this.baseUrl + `admin/products/${id}/images`, images, {
      responseType: 'json' as 'json'
    });
  }

  public deleteImage(productOptionId,id) {
    return this.httpClient.delete<ProductOption>(this.baseUrl + `admin/products/${productOptionId}/images/${id}`, {
      responseType: 'json' as 'json'
    });
  }

  public changeImageProductOption(productOptionId,id, image) {
    return this.httpClient.put<ProductOption>(this.baseUrl + `admin/products/${productOptionId}/images/${id}`, image, {
      responseType: 'json' as 'json'
    });
  }

  public changeImageBrand(id, image) {
    return this.httpClient.put<Brand>(this.baseUrl + `admin/brands/${id}/images`, image, {
      responseType: 'text' as 'json'
    });
  }

  public findAllProductOptions(title, option) {
    return this.httpClient.get<ProductOption[]>(this.baseUrl + `products/${title}/${option}`, {
      responseType: 'json' as 'json'
    });
  }

  public createProduct(request) {
    return this.httpClient.post(this.baseUrl + 'admin/products', request, {responseType: 'text' as 'json'});
  }

  public isUserLoggedIn() {
    let user = localStorage.getItem('token');
    return !(user === null);
  }

  public getUsers(page, size, direction, sortBy, search) {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    if (search) {
      params = params.set('search', search);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (direction) {
      params = params.set('direction', direction);
    }
    return this.httpClient.get<User[]>(this.baseUrl + 'admin/users', {params: params, responseType: 'json'});
  }

  public getUsersOrder(page, size) {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    return this.httpClient.get<Order[]>(this.baseUrl + 'api/orders', {
      params: params,
      responseType: 'json'
    });
  }

  public getProducts(page, size, direction, sortBy, search) {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    if (search) {
      params = params.set('search', search);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (direction) {
      params = params.set('direction', direction);
    }
    return this.httpClient.get<ProductOption[]>(this.baseUrl + 'admin/products', {params: params, responseType: 'json'});
  }

  public getCoupons(page, size, direction, sortBy, search) {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('size', size);
    if (search) {
      params = params.set('search', search);
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (direction) {
      params = params.set('direction', direction);
    }
    return this.httpClient.get<Coupon[]>(this.baseUrl + 'admin/coupons', {params: params, responseType: 'json'});
  }

  public getBrands() {
    return this.httpClient.get<Brand[]>(this.baseUrl + 'admin/brands', {responseType: 'json'});
  }

  public addBrand(addBrand) {
    return this.httpClient.post<string>(this.baseUrl + 'admin/brands', addBrand, {responseType: 'text' as 'json'});
  }

  public updateBrand(id, brand) {
    let params = new HttpParams();
    params = params.set('brand', brand);
    return this.httpClient.put<string>(this.baseUrl + `admin/brands/${id}`, params, {responseType: 'text' as 'json'});
  }

  public disableEnableSale(id){
    return this.httpClient.put(this.baseUrl + `admin/coupons/${id}`,{}, {responseType: 'text' as 'json'});
  }

  public enableDisableSale(id) {
    return this.httpClient.put<string>(this.baseUrl + `admin/products/${id}/sale`, {}, {responseType: 'text' as 'json'});
  }

  public cancelOrder(id) {
    return this.httpClient.put(this.baseUrl + `order/${id}`, {}, {responseType: 'text' as 'json'});
  }

  public setPayment(payment) {
    let params = new HttpParams();
    params = params.set('payment', payment);
    return this.httpClient.put<string>(this.baseUrl + 'payment', params, {responseType: 'text' as 'json'});
  }

  public setDelivery(delivery) {
    let params = new HttpParams();
    params = params.set('delivery', delivery);
    return this.httpClient.put<string>(this.baseUrl + 'delivery', params, {responseType: 'text' as 'json'});
  }

  public getCarousel() {
    return this.httpClient.get<Carousel[]>(this.baseUrl + 'products/carousel', {responseType: 'json' as 'json'});
  }

  public getAlerts() {
    return this.httpClient.get<Alert[]>(this.baseUrl + 'products/alerts', {responseType: 'json' as 'json'});
  }

  public addCarousel(formData) {
    return this.httpClient.post<string>(this.baseUrl + 'admin/carousel', formData, {responseType: 'text' as 'json'});
  }

  public updateCarousel(id,carousel) {
    return this.httpClient.put<string>(this.baseUrl + `admin/carousel/${id}`, carousel, {responseType: 'text' as 'json'});
  }

  public deleteCarousel(id) {
    return this.httpClient.delete<string>(this.baseUrl + `admin/carousel/${id}`, {responseType: 'text' as 'json'});
  }

  public addAlert(alert) {
    return this.httpClient.post<string>(this.baseUrl + 'admin/alerts', alert, {responseType: 'text' as 'json'});
  }

  public updateAlert(id,alert) {
    return this.httpClient.put<string>(this.baseUrl + `admin/alerts/${id}`, alert, {responseType: 'text' as 'json'});
  }

  public deleteAlert(id) {
    return this.httpClient.delete<string>(this.baseUrl + `admin/alerts/${id}`, {responseType: 'text' as 'json'});
  }

  public changePriceOfPayment(id,price) {
    let params = new HttpParams();
    params = params.set('price', price);
    return this.httpClient.put<string>(this.baseUrl + `admin/payments/${id}`,params, {responseType: 'text' as 'json'});
  }

  public changePriceOfDelivery(id,price) {
    let params = new HttpParams();
    params = params.set('price', price);
    return this.httpClient.put<string>(this.baseUrl + `admin/deliveries/${id}`,params, {responseType: 'text' as 'json'});
  }

  public errorSnackBar(message) {
    let snackBarRef = this.matSnackBar.open('✘️  ' + message, 'OK', {duration: 3000, horizontalPosition: 'end', panelClass: ['error']});
    snackBarRef.onAction().subscribe();
  }

  public successSnackBar(message) {
    let snackBarRef = this.matSnackBar.open('✔ ' + message, 'OK', {duration: 3000, horizontalPosition: 'end', panelClass: ['success']});
    snackBarRef.onAction().subscribe();
  }


  public logout() {
    this.router.navigate(['/login']).then((navigated: boolean) => {
      if (navigated) {
        this.errorSnackBar('Sucessfully logged out');
      }
    });
    localStorage.removeItem('token');
    this.getCart().subscribe(
      res => {
        this.editCart(res);
      }
    );
    this.editUser(null);
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
