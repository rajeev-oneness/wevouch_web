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
    if (localStorage.getItem('we_vouch_user')) {
      this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
      this._api.ticketList(this.userDetails._id).subscribe((res) => {
        this.ticketList = res;
        this._loader.stopLoader('loader');
      });
    }
  }
}
