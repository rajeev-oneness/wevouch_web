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
  public ticketId: string = '';
  public ticketLogs: any= [];
  public userDetail: any = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
  });

  constructor(private route: ActivatedRoute, private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router, private _activated:ActivatedRoute) { 
    this._loader.startLoader('loader');
    this.ticketId = this._activated.snapshot.paramMap.get('ticketId');
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
      this.fetchTicketLogs();
    }
  }

  fetchTicketLogs() {
    this._api.getTicketLog(this.ticketId).subscribe(
      res => {
        // console.log('Logs :',res);
        this.ticketLogs = res.filter((t : any) => t.logType === "Go To Customer");
        console.log('Logs :',this.ticketLogs);
      }, err => {}
    )
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

  approveLog(logId:string, approved:boolean = true) {
    Swal.fire({
      title: 'Approval',
      text: 'Are you sure to change approval status',
      icon: 'info',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send Approval',
    }).then((result) => {
      if (result.isConfirmed) {
        this._api.approveTicketLog(logId, {approved}).subscribe(
          res => {
            if (res.error === false) {
              this.Toast.fire({
                icon: 'success',
                title: 'Log approval changed!'
              });
              this.fetchTicketLogs();
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'failed!'
              });
            }
          }, err => {
            this.Toast.fire({
              icon: 'error',
              title: 'Something went wrong'
            });
          }
        )
        
      }
    })
    
  }


  feedbackTab: boolean = false;
  toggleFeedback() {
    this.feedbackTab =! this.feedbackTab
  }

  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  feedback: string = '';
  countStar(star:any) {
    this.rating = star;
    console.log('Value of star', star);
  }

  submitFeedback() {
    if (this.rating && this.feedback) {
      this._api.ticketFeedbackAdd(this.ticketId, {rating: this.rating,feedback: this.feedback}).subscribe(
        res => {
          if (res.error === false) {
            this.Toast.fire({
              icon: 'success',
              title: 'Feedback added'
            });
            this._router.navigate(['/ticket/list'])
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Failed!'
            });
          }
        }, err => {
          this.Toast.fire({
            icon: 'error',
            title: 'Something went wrong'
          });
        }
      )
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Rating/feedback can not empty!'
      });
    }
  }

}
