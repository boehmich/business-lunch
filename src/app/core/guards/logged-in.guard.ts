import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {Injectable} from "@angular/core";


@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let getAccessToPage = true;
    const userInLocalStorage = this.authenticationService.getAuthenticationData();

    if(state.url === '/' && userInLocalStorage !== undefined){
      getAccessToPage = false;
      this.router.navigate(['/list']);
    }

    if(state.url === '/list' && userInLocalStorage === undefined){
      getAccessToPage = false;
      this.router.navigate(['/']);
    }

    return getAccessToPage;
  }

}
