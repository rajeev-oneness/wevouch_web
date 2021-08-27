import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public mainLogin: any = true;
  public otpStep1: any = false;
  public otpStep2: any = false;
  public otpMobile: any = '';
  public otp1: any = '';
  public otp2: any = '';
  public otp3: any = '';
  public otp4: any = '';

  constructor(private _api:ApiService,private _loader : NgxUiLoaderService,private _router:Router) {
    this._loader.startLoader('loader');
  }
  public errorMessage = '';
  ngOnInit(): void {
    // if(this._api.isAuthenticated()){
    //   this._router.navigate(['/dashboard']);
    // }
    this._loader.stopLoader('loader');
  }

  userLoginSubmit(formData){
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      this._loader.startLoader('loader');
      this._api.userLoginAPI(formData.value).subscribe(
        res => {
          this._api.storeUserLocally(res.user);
          this._loader.stopLoader('loader');
          this._router.navigate(["/user/dashboard"]);
        },
        err => {
          this.errorMessage = err.error.message;
          this._loader.stopLoader('loader');
        }
        
      )
    }else{
      this.errorMessage = 'Please fill out all the details';
    }
    // console.log('Form Data SUbmitted');
  }

  loginWithOtp() {
    this.mainLogin = false;
    this.otpStep1 = true;
    this.otpStep2 = false;
  }
  
  enterOtp() {
    console.log(this.otpMobile);
     
    this.mainLogin = false;
    this.otpStep1 = false;
    this.otpStep2 = true;
  }

  submitOtp() {
    const mainOtp = this.otp1+this.otp2+this.otp3+this.otp4
    const mainForm = {
      "mobile" : this.otpMobile,
      "otp" : mainOtp.toString()
    }
    this._api.loginWithOtp(mainForm).subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log(res);
        this._api.storeUserLocally(res);
        this._loader.stopLoader('loader');
        this._router.navigate(["/user/dashboard"]);
      }, err => {}
    )
  }
}
