import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthenticationService} from "../../core/services/authentication.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public isLoading: Boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  onLogin(form: NgForm) {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authenticationService.login(form.value.email, form.value.password)
      .then(() => {
        this.isLoading = false;
        this.router.navigate(['/list']);
      })
      .catch(error => {
        //console.log(error)
        this.isLoading = false;
      });
  }
}
