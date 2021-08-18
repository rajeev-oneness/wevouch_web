import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
declare var Razorpay: any;
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  
  public packages : any = ''
  public userInfo: any = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
  public purchaseOptions: any = {};

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.getPackageList();
  }

  getPackageList() {
    this._api.packageList().subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log(res);
        this.packages = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
  
  initPay(packageId : any) {
    this._api.packageDetail(packageId).subscribe(
      res => {
        console.log(res);
        let prefilledData = {
          'name': this.userInfo.name,
          'email': this.userInfo.email,
          'contact': this.userInfo.mobile
        }
        let userId = this.userInfo._id;
        let subscriptionId = res._id;
        this.purchaseOptions = {
          "key": environment.rzp_key_id,
          "amount": res.amount*100,
          "currency": "INR",
          "name": "WeVouch",
          "description": res.name + " Subscription",
          "image": "../assets/images/logo-icon.png",
          "handler": (response : any) => {
            console.log(response, userId);
            this._api.updateUserDetails({'_id': userId,'subscriptionId': subscriptionId}).subscribe(
              res => {
                console.log(res);
                this._api.updateUserLocally(res);
                Swal.fire({
                  title: 'Purchased!',
                  text: 'Your payment is successfull. Payment Id: '+response.razorpay_payment_id+' .Please note the payment Id',
                  icon: 'success',
                  confirmButtonText: 'Done!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire(
                      'Redirecting...',
                      'success'
                    )
                    // this._router.navigate(['/user/profile']);
                    window.location.href = environment.basePath+'user/profile';
                  }
                })
              }, err => {}
            )
            
          },
          "prefill": prefilledData,
          "notes": {
            // "subscription": "Buying subscription"
          },
          "theme": {
            "color": "#00c0c9"
          }
        }
        var rzp1 = new Razorpay(this.purchaseOptions);
        rzp1.open();
      }, err => {}
    );
    
    
  }

}
