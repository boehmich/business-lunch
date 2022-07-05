import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthenticationService} from "../core/services/authentication.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
  public userIsAdmin: Boolean = false;
  public userIsAuthenticated: Boolean = false;
  public userName: string = '';
  private isAdminListenerSubscription!: Subscription;
  private authenticationListenerSubscription!: Subscription;
  private userNameListenerSubscription!: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    //this.userIsAuthenticated = this.authenticationService.getUserIsAuthenticated();
    //this.userIsAdmin = this.authenticationService.getUserIsAdmin();
    this.isAdminListenerSubscription = this.authenticationService.getIsAdminStatusListener()
      .subscribe(isAdmin => {
        this.userIsAdmin = isAdmin;
      });
    this.authenticationListenerSubscription = this.authenticationService.getAuthenticationStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userNameListenerSubscription = this.authenticationService.getUserNameStatusListener()
      .subscribe(userName =>{
        this.userName = userName!;
      });

  }

  ngOnDestroy() {
    this.isAdminListenerSubscription.unsubscribe();
    this.authenticationListenerSubscription.unsubscribe();
    this.userNameListenerSubscription.unsubscribe();
  }

  public logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
