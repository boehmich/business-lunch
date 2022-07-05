import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppMaterialModule} from './app-material.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from "./header/header.component";
import {LoginComponent} from "./authentication/login/login.component";
import {InvoiceListComponent} from "./invoice/invoice-list/invoice-list.component";
import {InvoiceCreateComponent} from "./invoice/invoice-create/invoice-create.component";
import {AppRoutingModule} from "./app-routing.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SignupComponent} from "./authentication/signup/signup.component";
import {AuthenticationInterceptor} from "./core/interceptor/authentication.interceptor";
import {AppInitService} from "./core/services/app-init.service";
import {ErrorInterceptor} from "./core/interceptor/error.interceptor";
import {ErrorComponent} from "./error/error.component";

export function initApp(appInitService: AppInitService){
  return async () => {
    await appInitService.init();
    console.log('APP INIT SUCCESS!');
    return Promise.resolve();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    InvoiceListComponent,
    InvoiceCreateComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: APP_INITIALIZER, useFactory: initApp, deps: [AppInitService], multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
