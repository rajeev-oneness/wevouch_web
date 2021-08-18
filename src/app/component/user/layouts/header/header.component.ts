import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userDetails: any = {};
  constructor(private _api:ApiService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
  }
  logOutUser() {
    this._api.logoutUser();
  }
}
