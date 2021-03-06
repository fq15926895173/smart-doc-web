import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { NotificationService } from 'app/core/notification/notification.service';

@Injectable()
export class CommonInterceptorService implements HttpInterceptor {

  private urlTime = {};

  constructor(
    private notification: NotificationService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' && this.urlTime[req.url] && Date.now() - this.urlTime[req.url] < 1000) {
      this.notification.show({
        title: '请求过于频繁',
        type: 'error',
        duration: 1500,
        close: true
      });
      return Observable.throw(new Error('overrequest'));
    } else if (req.method !== 'GET') {
      this.urlTime[req.url] = Date.now();
    }

    let _req = req.clone({ withCredentials: true });

    if (_req.url.indexOf('//') === -1) {
      _req = _req.clone({ url: environment.apiPath + _req.url });
    }

    // IE 浏览器可能对get请求结果进行缓存
    // if (_req.method == 'GET') {
    //   _req = _req.clone({
    //     setHeaders: {
    //       'If-Modified-Since': '0',
    //       'Cache-Control': 'no-cache'
    //     }
    //   })
    // }

    return next.handle(_req).catch(resError => {
      let notice = '';
      if (resError.status === 401) {
        notice = '会话超时';
        this.router.navigateByUrl('/welcome/login');
      } else if (resError.status !== 400) {
        notice = '网络异常';
      }

      if (notice) {
        this.notification.show({
          title: notice,
          type: 'error',
          duration: 3000,
          close: true
        });
      }

      return Observable.throw(resError);
    });
  }

}
