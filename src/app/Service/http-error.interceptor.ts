import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ApiService} from './api.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private apiService: ApiService, private matDialo: MatDialog) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error.message !== undefined && error.error.message !== null) {
            errorMsg = error.error.message;
          } else {
            try {
              var err = JSON.parse(error.error);
              errorMsg = err.message;
            } catch (e) {
              errorMsg = error.error;
            }
          }

          if (errorMsg === 'User account with this email address does not exist.' || errorMsg.includes('Your account is locked till') || errorMsg === 'Access is denied' || errorMsg === 'Access Denied' || errorMsg === 'User token has expired!' || errorMsg === 'Token is not valid') {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
            this.apiService.getCart().subscribe(
              res => {
                this.apiService.editCart(res);
              }
            );
          }
          if (this.apiService.isUserLoggedIn() && errorMsg === 'Forbidden') {
            this.router.navigate(['']);
          }
          if (errorMsg === 'Cart is not present.') {
            this.apiService.getCart().subscribe(
              res => {
                this.apiService.editCart(res);
              }
            );
          }
          this.apiService.errorSnackBar(errorMsg);

          return throwError(errorMsg);
        })
      );
  }
}
