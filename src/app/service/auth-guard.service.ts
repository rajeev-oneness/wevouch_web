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
      this._router.navigate(['/login']);
      return false;
    }
  }
}
