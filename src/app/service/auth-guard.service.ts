import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _api:ApiService,private _router:Router) { }

  canActivate():boolean{
    console.log("Hello 1");
    let token = this._api.isAuthenticated();
    if(token){
      return true;
    }else{
      console.log("hello");
      this.checkCookie()
    }
  }

  getCookie() {
    let name = "wevouchUser=";
    let user = '';
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c : any = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        user = c.substring(name.length, c.length);
        console.log(user);
      }
    }
    return user;
  }

  checkCookie() {
    console.log("CHecking Cookie");
    
    let user = this.getCookie();
    if (user != "") {
      this._api.storeUserLocally(JSON.parse(user));
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
