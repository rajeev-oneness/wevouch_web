import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public userDetails: any = {};
  public productCount: number = 0;
  constructor(private _loader: NgxUiLoaderService, private _api: ApiService) { }
  
  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
    this._api.productList(this.userDetails._id).subscribe((res) => {
    this.productCount = res.length;
    });
  }

}
