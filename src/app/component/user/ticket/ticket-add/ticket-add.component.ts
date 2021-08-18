import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {ActivatedRoute, Router} from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.css'],
})

export class TicketAddComponent implements OnInit {

  public issueType: string = '';
  public functionType: string = '';
  public description: string = '';
  public errorMessage: string = '';
  public isFirstTab: boolean = true;
  public isSecondTab: boolean = false;
  public address: string = "";
  public isThirdTab: boolean = false;
  public selectedDate: string = "";
  public selectedTime: string = "";
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}
  secondTab() {
    if (this.issueType && this.functionType && this.description) {
      this.errorMessage="";
      this.isFirstTab= false;
      this.isSecondTab= true;
    } else {
      this.errorMessage = 'Please give all the details';
    }
  }

  goToLast()
  {
    if(this.address)
    {
      this.isSecondTab = false;
      this.isThirdTab= true;
      this.errorMessage= "";
    }
    else
    {
      this.errorMessage=" Please give the address";
    }
  }

  submitTicket()
  {
    if(this.selectedDate && this.selectedTime)
    {
      this._loader.startLoader('loader');
      if(localStorage.getItem("we_vouch_user"))
      {
        this._api.getProductDetailsById(this.route.snapshot.paramMap.get('productId')).subscribe(
          productDetails => {
            const userId = JSON.parse(localStorage.getItem("we_vouch_user"))._id;
            const tosendData = {
              issueType: this.issueType,
              functionType: this.functionType,
              description: this.description,
              address: this.address,
              selectedDate: this.selectedDate,
              selectedTime: this.selectedTime,
              userId,
              productId: productDetails._id,
              category: productDetails.category?._id,
              brandId: productDetails.brands?._id
            };
            this._api.addTicket(tosendData).subscribe(
              res=>{
                this.Toast.fire({
                  icon: 'success',
                  title: 'Tcket raised successfully!'
                })
                this.router.navigate(['/user/ticket/list']);
              }
            )
          }
        )
      
      }
    }
    else
    {
      this.errorMessage=" Please give all the details.";
    }
  }
}
