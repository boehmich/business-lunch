import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthenticationService} from "../../core/services/authentication.service";


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent{
  public isLoading: Boolean = false;

  constructor(private authenticationService: AuthenticationService) {
  }

  onSignup(form: NgForm) {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    const isAdmin = form.value.isAdmin !== ''
    this.authenticationService.createUser(form.value.firstname, form.value.surname, form.value.email, form.value.password, isAdmin)
      .then(response => {
        console.log(response);
        form.onReset()
        this.isLoading = false;
      }).catch(error => console.log(error));
  }
}
