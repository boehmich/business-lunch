import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";

@Injectable({providedIn: 'root'})

export class AppInitService{

  constructor(private authenticationService: AuthenticationService) {
  }

  public init(){
    return new Promise<void>(async (resolve) => {
      try {
        await this.authenticationService.autoAuthenticationUser();
        resolve();
      } catch (exception) {
        console.log(exception);
      }
    });
  }
}
