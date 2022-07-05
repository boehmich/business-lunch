import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {LoginComponent} from "./authentication/login/login.component";
import {InvoiceListComponent} from "./invoice/invoice-list/invoice-list.component";
import {InvoiceCreateComponent} from "./invoice/invoice-create/invoice-create.component";
import {SignupComponent} from "./authentication/signup/signup.component";
import {AuthenticationGuard} from "./core/guards/authentication.guard";
import {LoggedInGuard} from "./core/guards/logged-in.guard";


const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoggedInGuard] },
  { path: 'list', component: InvoiceListComponent, canActivate: [LoggedInGuard] },
  { path: 'create', component: InvoiceCreateComponent, canActivate: [AuthenticationGuard] },
  { path: 'edit/:invoiceId', component: InvoiceCreateComponent, canActivate: [AuthenticationGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [
    AuthenticationGuard,
    LoggedInGuard
  ]
})

export class AppRoutingModule{}
