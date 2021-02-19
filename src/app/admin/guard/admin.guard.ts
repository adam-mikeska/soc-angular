import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiService} from '../../Service/api.service';
import {map} from 'rxjs/operators';
import {User} from '../../Models/User';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivateChild {
  constructor(private apiService: ApiService, public router: Router, public activatedRoute: ActivatedRoute) {
  }

  user: User;

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!this.apiService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    } else{
      return this.apiService.cast.pipe(map(
        res => {
          if(res.role) {
            this.user = res;
            return this.checker(state, res);
          }
        }
      ));
    }
  }

  checker(state: RouterStateSnapshot, res: User) {
    if (res.role?.permissions.includes('*')) {
      return true;
    }
    if (state.url.includes('dashboard') && res.role?.permissions.includes('display_dashboard')) {
      return true;
    } else if (state.url.includes('dashboard') && !res.role?.permissions.includes('display_dashboard')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    if (state.url.includes('users') && res.role?.permissions.includes('display_users')) {
      return true;
    } else if (state.url.includes('users') && !res.role?.permissions.includes('display_users')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }
    if (state.url.includes('products') && res.role?.permissions.includes('display_products')) {
      return true;
    } else if (state.url.includes('products') && !res.role?.permissions.includes('display_products')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    if (state.url.includes('orders') && res.role?.permissions.includes('display_orders')) {
      return true;
    } else if (state.url.includes('orders') && !res.role?.permissions.includes('display_orders')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    if (state.url.includes('brands') && res.role?.permissions.includes('display_brands')) {
      return true;
    } else if (state.url.includes('brands') && !res.role?.permissions.includes('display_brands')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    if (state.url.includes('roles') && res.role?.permissions.includes('display_roles')) {
      return true;
    } else if (state.url.includes('roles') && !res.role?.permissions.includes('display_roles')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    if (state.url.includes('categories') && res.role?.permissions.includes('display_categories')) {
      return true;
    } else if (state.url.includes('categories') && !res.role?.permissions.includes('display_categories')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    if (state.url.includes('coupons') && res.role?.permissions.includes('display_coupons')) {
      return true;
    } else if (state.url.includes('coupons') && !res.role?.permissions.includes('display_coupons')) {
      this.router.navigate([(this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? '/' : this.checkIfCanBeRedirected(this.user, state.url))]);
      return (this.checkIfCanBeRedirected(this.user, state.url) === 'none' ? false : true);
    }

    return false;
  }

  checkIfCanBeRedirected(user: User, url: string) {
    if (url === '/admin/dashboard') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/users') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/orders') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/products') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/brands') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/categories') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/roles') {
      return this.permissionsChecker(user);
    } else if (url === '/admin/coupons') {
      return this.permissionsChecker(user);
    }
  }

  permissionsChecker(user: User) {
    if (user.role.permissions.includes('display_dashboard')) {
      return '/admin/dashboard';
    } else if (user.role.permissions.includes('display_users')) {
      return '/admin/users';
    } else if (user.role.permissions.includes('display_products')) {
      return '/admin/products';
    } else if (user.role.permissions.includes('display_orders')) {
      return '/admin/orders';
    } else if (user.role.permissions.includes('display_categories')) {
      return '/admin/categories';
    } else if (user.role.permissions.includes('display_roles')) {
      return '/admin/roles';
    } else if (user.role.permissions.includes('display_brands')) {
      return '/admin/brands';
    } else if (user.role.permissions.includes('display_coupons')) {
      return '/admin/coupons';
    }else  {
      return 'none';
    }
  }
}
