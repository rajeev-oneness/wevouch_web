import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
})

export class TicketListComponent implements OnInit {
  public userDetails: any = {};
  public ticketList: any = [];
  constructor(private _api: ApiService, private _loader: NgxUiLoaderService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('we_vouch_user'));
    this._api.ticketList(user._id).subscribe((res) => {
      this._loader.startLoader('loader');
      this.ticketList = res;
      console.log(res);
      this._loader.stopLoader('loader');
    });
    this._api.userDetails(user._id).subscribe(
      res => {
        this.userDetails = res;
      }
    )
  }

}
