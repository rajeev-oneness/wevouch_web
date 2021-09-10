import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _api:ApiService,private _router:Router) { }

  canActivate():boolean{
    let token = this._api.isAuthenticated();
    if(token){
      return true;
    }else{
      this.checkCookie()
    }
  }

  getCookie() {
    let name = "wevouchUser=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c : any = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        let user = c.substring(name.length, c.length);
        console.log(user);
        return user;
      }
    }
    return false;
  }

  checkCookie() {
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
