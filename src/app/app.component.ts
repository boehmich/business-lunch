import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./core/services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'business-lunch';

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    //this.authenticationService.autoAuthenticationUser();
  }
}
