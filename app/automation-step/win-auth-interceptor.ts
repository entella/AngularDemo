import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';

@Injectable()
export class WinAuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    if (req.method === 'POST') {
      const authReq = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'q=0.8;application/json;q=0.9',
        }),
        withCredentials: true
      });
      return next.handle(authReq);
    } else {
      const authReq = req.clone({
        withCredentials: true           
      });
      return next.handle(authReq);     
    }
  }
}
