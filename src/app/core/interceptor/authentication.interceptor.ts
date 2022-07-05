import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()

export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authenticationToken = this.authenticationService.getToken();
    const authenticationRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authenticationToken)
    });
    return next.handle(authenticationRequest);
  }

}
