import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {NavigationComponent} from './navigation/navigation.component';
import {DialogloginComponent} from './login/dialoglogin/dialoglogin.component';
import {RegisterComponent} from './register/register.component';
import {adminComponent} from './admin/admin.component';
import {adminGuard} from './admin/guard/admin.guard';
import {LoginGuard} from './login/guard/login.guard';
import {RegistrerGuard} from './register/guard/registrer.guard';
import {SettingsComponent} from './settings/settings.component';
import {PersonalComponent} from './settings/personal/personal.component';
import {SecurityComponent} from './settings/security/security.component';
import {SettingsGuard} from './settings/guard/settings.guard';
import {Change2FADialogComponent} from './settings/security/change2-fadialog/change2-fadialog.component';
import {ApiService} from './Service/api.service';
import {LogoutDialogComponent} from './navigation/logout-dialog/logout-dialog.component';
import {ChangePasswordComponent} from './login/change-password/change-password.component';
import {ChartsModule} from 'ng2-charts';
import {UsersComponent} from './admin/users/users.component';
import {ViewUserComponent} from './admin/users/view-user/view-user.component';
import {BlockuserComponent} from './admin/users/block-user/blockuser.component';
import {EditUserComponent} from './admin/users/edit-user/edit-user.component';
import {SendEmailComponent} from './admin/users/send-email/send-email.component';

import {LoadingComponent} from './loading/loading.component';
import {LoaderService} from './Service/loader.service';
import {LoadInterceptor} from './Service/load.interceptor';
import {MatBadgeModule} from '@angular/material/badge';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {IndexComponent} from './index/index.component';
import {RolesComponent} from './admin/roles/roles.component';
import {ProductsComponent} from './admin/products/products.component';
import {OrdersComponent} from './admin/orders/orders.component';
import {CategoriesComponent} from './admin/categories/categories.component';
import {UiComponent} from './admin/ui/ui.component';
import {CreateRoleDialogComponent} from './admin/roles/create-role-dialog/create-role-dialog.component';
import {AsignRoleComponent} from './admin/users/asign-role/asign-role.component';
import {CustomInterceptor} from './Service/custom.interceptor';
import {CartComponent} from './cart/cart.component';
import {HttpErrorInterceptor} from './Service/http-error.interceptor';
import {ProductComponent} from './product/product.component';

import {GalleryModule} from '@ks89/angular-modal-gallery';
import {ErrorComponent} from './error/error.component';
import {BrandsComponent} from './admin/brands/brands.component';
import {OrderDetailsComponent} from './admin/orders/order-details/order-details.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {AddProductComponent} from './admin/products/add-product/add-product.component';
import {EditProductComponent} from './admin/products/edit-product/edit-product.component';
import {ManageOrderComponent} from './admin/orders/manage-order/manage-order.component';
import { AddBrandComponent } from './admin/brands/add-brand/add-brand.component';

import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {UserOrdersComponent} from './settings/users-orders/user-orders.component';
import { UserOrderDetailsComponent } from './settings/users-orders/user-order-details/user-order-details.component';
import { CancelOrderComponent } from './settings/users-orders/cancel-order/cancel-order.component';
import { CouponsComponent } from './admin/coupons/coupons.component';
import { CategoryComponent } from './category/category.component';
import { ConfirmUpdateOrderitemComponent } from './admin/orders/manage-order/confirm-update-orderitem/confirm-update-orderitem.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { DiscountProductsComponent } from './admin/products/discount-products/discount-products.component';
import { CreateCouponComponent } from './admin/coupons/create-coupon/create-coupon.component';
import { SearchComponent } from './search/search.component';
import {ColorPickerModule} from 'ngx-color-picker';
import { AddCarouselComponent } from './admin/ui/add-carousel/add-carousel.component';
import { AddAlertComponent } from './admin/ui/add-alert/add-alert.component';
import { FooterComponent } from './footer/footer.component';

const appRoutes: Routes = [

  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginComponent,
    data : {
      comp: 'Login'
    }
  },
  {
    path: '',
    component: IndexComponent,
    data : {
      comp: 'Ecommerce'
    }
  },
  {
    path: 'product/:title/:option',
    component: ProductComponent,
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent,
    data : {
      comp: 'Order'
    }
  },
  {
    path: 'settings',
    redirectTo: 'settings/personal'
  },
  {
    path: 'admin',
    redirectTo: 'admin/users'
  },
  {
    path: 'category',
    component: CategoryComponent,
    children: [
      { path: '**', component: CategoryComponent}
    ]
  },

  {
    path: 'admin',
    component: adminComponent,
    canActivateChild: [adminGuard],
    data : {
      comp: 'Admin',
    },
    children: [
      {path: 'users', component: UsersComponent, data : {comp: 'Admin/Users'}},
      {path: 'coupons', component: CouponsComponent, data : {comp: 'Admin/Coupons'}},
      {path: 'others', component: UiComponent, data : {comp: 'Admin/Others'}},
      {path: 'roles', component: RolesComponent, data : {comp: 'Admin/Roles'}},
      {path: 'brands', component: BrandsComponent, data : {comp: 'Admin/Brands'}},
      {path: 'categories', component: CategoriesComponent, data : {comp: 'Admin/Categories'}},
      {path: 'orders', component: OrdersComponent, data : {comp: 'Admin/Orders'}},
      {path: 'products', component: ProductsComponent, data : {comp: 'Admin/Products'}},
    ]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [SettingsGuard],
    children: [
      {path: 'personal', component: PersonalComponent, data : {comp: 'Settings/Personal'}},
      {path: 'security', component: SecurityComponent, data : {comp: 'Settings/Security'}},
       {path: 'orders', component: UserOrdersComponent, data : {comp: 'Settings/Orders'}},
    ]
  },
  {
    path: 'cart',
    component: CartComponent,
    data : {comp: 'Cart'}
  },
  {
    path: 'search',
    component: SearchComponent,
    data : {comp: 'Search'}
  },
  {
    path: 'register',
    canActivate: [RegistrerGuard],
    component: RegisterComponent
    , data : {comp: 'Register'},
  },
  {
    path: 'error',
    component: ErrorComponent,
    data : {comp: 'Error'},
  },
  {path: '**', redirectTo: '/error'}

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    DialogloginComponent,
    RegisterComponent,
    adminComponent,
    SettingsComponent,
    PersonalComponent,
    SecurityComponent,
    Change2FADialogComponent,
    LogoutDialogComponent,
    ChangePasswordComponent,
    UsersComponent,
    ViewUserComponent,
    BlockuserComponent,
    EditUserComponent,
    SendEmailComponent,
    LoadingComponent,
    RolesComponent,
    ProductsComponent,
    OrdersComponent,
    CategoriesComponent,
    UiComponent,
    IndexComponent,
    CreateRoleDialogComponent,
    AsignRoleComponent,
    CartComponent,
    ProductComponent,
    BrandsComponent,
    OrderDetailsComponent,
    CheckoutComponent,
    AddProductComponent,
    EditProductComponent,
    ManageOrderComponent,
    AddBrandComponent,
    UserOrdersComponent,
    UserOrderDetailsComponent,
    CancelOrderComponent,
    CouponsComponent,
    CategoryComponent,
    ConfirmUpdateOrderitemComponent,
    ConfirmDeleteComponent,
    DiscountProductsComponent,
    CreateCouponComponent,
    SearchComponent,
    AddCarouselComponent,
    AddAlertComponent,
    FooterComponent
  ],
  imports: [
    CKEditorModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    BsDropdownModule.forRoot(),
    NgbModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    ChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    GalleryModule.forRoot(),
    CdkTreeModule,
    MatTreeModule,
    ColorPickerModule,

  ],
  providers: [
    ApiService,
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: LoadInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
