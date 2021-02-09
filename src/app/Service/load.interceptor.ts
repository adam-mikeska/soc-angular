import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from './loader.service';
import {finalize} from 'rxjs/operators';

@Injectable()
export class LoadInterceptor implements HttpInterceptor {

  constructor(public loaderService: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let finished = false;
    setTimeout(() => {
      if (!finished) {
        this.loaderService.show();
      }
    }, 300);
    return next.handle(req).pipe(
      finalize(() => {
        finished = true, this.loaderService.hide();
      })
    );

  }
}
