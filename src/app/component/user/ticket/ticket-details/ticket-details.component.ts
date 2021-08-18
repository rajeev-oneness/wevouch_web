import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailComponent implements OnInit {
  public _id: string;
  public ticketDetails: any= {};
  constructor(private route: ActivatedRoute, private _loader:NgxUiLoaderService, private _api:ApiService) { 
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('ticketId');
    if(this._id)
    {
      this._loader.startLoader('loader');
      this._api.getTicketDetailsById(this._id).subscribe(
        res => {
          this.ticketDetails = res;
          this._loader.stopLoader('loader');
        }
      )
    }
  }

}
