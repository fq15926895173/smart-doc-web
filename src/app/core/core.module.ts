import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';
import { CommonInterceptorService } from './common-interceptor.service';
import { StoreService } from './store.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [NotificationComponent],
  entryComponents: [NotificationComponent],
  exports: [NotificationComponent, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonInterceptorService,
      multi: true,
    },
    NotificationService,
    StoreService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
