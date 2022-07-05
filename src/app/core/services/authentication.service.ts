import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Authentication} from "../models/authentication.model";
import {User} from "../models/user.model";

const USER_RESOURCE_URL = 'http://localhost:3000/api/user/';

@Injectable({providedIn: 'root'})

export class AuthenticationService{
  private isAuthenticated = false;
  private token!: string | null;
  public authenticationStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId!: string | null;
  private userName!: string | null;
  private isAdmin: boolean = false;
  private isAdminStatusListener = new Subject<boolean>();
  private userNameStatusListener = new Subject<string | null>();

  constructor(private httpClient: HttpClient) {
  }

  public createUser(firstname: string, surname: string, email: string, password: string, isAdmin: boolean){
    const userData: User = {
      firstname: firstname,
      surname: surname,
      email: email,
      password: password,
      isAdmin: isAdmin
    }
    return this.httpClient.post(USER_RESOURCE_URL + 'signup', userData).toPromise();
  }

  public login(email: string, password: string) {
    const authenticationData: Authentication = {
      email: email,
      password: password
    };
    return this.httpClient.post<{token: string, expiresIn: number, userId: string, userName: string, isAdmin: boolean}>(USER_RESOURCE_URL + 'login', authenticationData).toPromise()
      .then(response => {
        this.token = response.token;
        if(this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthenticationTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authenticationStatusListener.next(true);
          this.userId = response.userId;
          this.userName = response.userName;
          this.userNameStatusListener.next(this.userName);
          this.isAdmin = response.isAdmin;
          this.isAdminStatusListener.next(response.isAdmin);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthenticationData(this.token, expirationDate, this.userId);
        }
      });
  }

  public logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authenticationStatusListener.next(false);
    this.isAdmin = false;
    this.isAdminStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthenticationData();
    this.userId = null;
    this.userNameStatusListener.next(null);
    this.userName = null;
  }

  public autoAuthenticationUser() {
    const authInformation = this.getAuthenticationData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.getIsUserAdmin(authInformation.userId!)
        .then(response => {
          this.userName = response.userName;
          this.userNameStatusListener.next(this.userName);
          this.isAdmin = response.isAdmin;
          this.isAdminStatusListener.next(response.isAdmin);
          return;
        })
        .then( () => {
          this.token = authInformation.token;
          this.isAuthenticated = true;
          this.userId = authInformation.userId;
          this.setAuthenticationTimer(expiresIn / 1000);
          this.authenticationStatusListener.next(true);
        })
    }
  }

  private getIsUserAdmin(userId: string) {
    return this.httpClient.get<{isAdmin: boolean, userName: string}>(USER_RESOURCE_URL + 'isAdmin/' + userId).toPromise();
  }

  private setAuthenticationTimer(duration: number){
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
  }

  private saveAuthenticationData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthenticationData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  public getAuthenticationData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  public getToken(){
    return this.token;
  }

  public getUserIsAuthenticated(){
    return this.isAuthenticated;
  }

  public getUserIsAdmin(){
    return this.isAdmin;
  }

  public getIsAdminStatusListener(){
    return this.isAdminStatusListener.asObservable();
  }

  public getAuthenticationStatusListener(){
    return this.authenticationStatusListener.asObservable();
  }

  public getUserNameStatusListener(){
    return this.userNameStatusListener.asObservable();
  }

  public getUserName() {
    return this.userName;
  }
}
