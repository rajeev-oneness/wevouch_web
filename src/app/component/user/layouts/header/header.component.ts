import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userDetails: any = {};
  constructor() { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
  }

}
