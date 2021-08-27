import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('closebutton') closebutton;
  @ViewChild('addressForm') addressForm;

  public issueType: string = '';
  public functionType: string = '';
  public description: string = '';
  public errorMessage: string = '';
  public isFirstTab: boolean = true;
  public isSecondTab: boolean = false;
  public transportationType: string = "On Site";
  public addressId: string = "";
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
  public user : any = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
  public userAddresses : any = []
  public addressData : any = {}
  public addressErrorMessage : any = ''

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getAddressData();
  }
  
  getAddressData() {
    this._api.getAddressListByUser(this.user._id).subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log('address :',res);        
        this.userAddresses = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

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
    if(this.addressId && this.transportationType)
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
              transportationType: this.transportationType,
              addressId: this.addressId,
              selectedDate: this.selectedDate,
              selectedTime: this.selectedTime,
              userId,
              productId: productDetails._id,
              category: productDetails.category?._id,
              brandId: productDetails.brands?._id
            };
            this._api.addTicket(tosendData).subscribe(
              res=>{
                console.log(res);
                
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

  saveAddress(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      const mainForm = formData.value;
      mainForm.userId = this.user._id;
      mainForm.latitude = '';
      mainForm.longitude = '';
        this._api.addAddress(mainForm).subscribe(
          res => {
            this.closeModal();
            this._loader.startLoader('loader');
            this.Toast.fire({
              icon: 'success',
              title: 'Address added successfully!'
            })
            this.getAddressData();
            this.emptyModal();
            this._loader.stopLoader('loader');
          }, err => {
            this.addressErrorMessage = 'Something went wrong!';
          }
        )
    } else {
      this.addressErrorMessage = 'Please fill out all the details';
    }
  }

  emptyModal() {
    this.addressForm.reset();
  }

  closeModal() {
    this.emptyModal();
    this.closebutton.nativeElement.click();
  }
}
