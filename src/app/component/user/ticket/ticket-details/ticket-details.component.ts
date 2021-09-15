import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailComponent implements OnInit {
  
  public _id: string;
  public ticketDetails: any= {};
  public ticketLogs: any= [];
  public userDetail: any = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');

  constructor(private route: ActivatedRoute, private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { 
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('ticketId');
    if(this._id)
    {
      this._loader.startLoader('loader');
      this._api.getTicketDetailsById(this._id).subscribe(
        res => {
          console.log(res);
          this.ticketDetails = res;
          this._loader.stopLoader('loader');
        }
      )
      this._api.getTicketLog(this._id).subscribe(
        res => {
          // console.log('Logs :',res);
          this.ticketLogs = res.filter((t) => t.logType === "Go To Customer");
          console.log('Logs :',this.ticketLogs);
        }, err => {}
      )
    }
  }

  deleteTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This Ticket will not recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loader.startLoader('loader');
        this._api.deleteTicket(this._id).subscribe(
          res => {
            console.log(res);
            const notificationForm = {
              "title": "Ticket Deleted", 
              "userId": this.userDetail._id, 
              "description": "Ticket "+this.ticketDetails.uniqueId+" has deleted."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
            this._router.navigate(['/user/ticket/list']);
            this._loader.stopLoader('loader');
          }, err => {}
        )
        Swal.fire(
          'Deleted!',
          'Ticket has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Ticket is safe :)',
          'error'
        )
      }
    })
    
  }

}
