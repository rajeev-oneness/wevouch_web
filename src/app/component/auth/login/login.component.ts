import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public mainLogin: boolean = true;
  public otpStep1: boolean = false;
  public otpStep2: boolean = false;
  public otpMobile: any = '';
  public forgotEmail: any = '';
  public forgotEmailStep1: boolean = false;
  public forgotEmailStep2: boolean = false;
  public removedNumber: any = '';
  public otp1: any = '';
  public otp2: any = '';
  public otp3: any = '';
  public otp4: any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  public errorMessage : any = '';
  public forgetPassEmailOtp : any = ''
  public newForgetPassword : any = ''
  public rememberMe : boolean = false

  constructor(private _api:ApiService,private _loader : NgxUiLoaderService,private _router:Router,private authService: SocialAuthService) {
    this._loader.startLoader('loader');
  }
  ngOnInit(): void {
    // if(this._api.isAuthenticated()){
    //   this._router.navigate(['/dashboard']);
    // }
    this._loader.stopLoader('loader');
  }

  rememberMeFunc() {
    this.rememberMe = !this.rememberMe;
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
          if(this.rememberMe === true) {
            console.log('remeber me selected');
            
            this._api.storeUserCookie(JSON.stringify(res.user));
          }
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
    this.errorMessage = ''
    this.mainLogin = false;
    this.otpStep1 = true;
    this.otpStep2 = false;
    this.forgotEmailStep1 = false;
    this.forgotEmailStep2 = false;
  }

  replaceFirst6(str) {
    this.removedNumber = str.replace(/^.{1,6}/, m=> "X".repeat(m.length))
  }
  
  enterOtp() {
    this.errorMessage = '';
    console.log(this.otpMobile);
    if (this.otpMobile) {
      this.replaceFirst6(this.otpMobile.toString());
      this.mainLogin = false;
      this.otpStep1 = false;
      this.otpStep2 = true;
      this.forgotEmailStep1 = false;
      this.forgotEmailStep2 = false;
    } else {
      this.errorMessage = 'Phone number can not be empty.';
    }
  }

  submitOtp() {
    this.errorMessage = '';
    if(this.otp1 && this.otp2 && this.otp3 && this.otp4) {
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
        }, err => {
          this.errorMessage = 'Something went wrong.';
        }
      )
    } else {
      this.errorMessage = 'OTP can not be empty.';

    }
  }

  forgotPassword() {
    this.errorMessage = '';

    this.mainLogin = false;
    this.otpStep1 = false;
    this.otpStep2 = false;
    this.forgotEmailStep1 = true;
    this.forgotEmailStep2 = false;
  }

  
  enterForgetPassEmail() {
    this.errorMessage = '';
    console.log(this.forgotEmail);
    
    if (this.forgotEmail) {
      const formData = {
        "email": this.forgotEmail
      }
      this._api.forgotPasswordReqSend(formData).subscribe(
        res => {
          this._loader.startLoader('loader');
          console.log(res);
          this.Toast.fire({
            icon: 'success',
            title: 'Check your email for OTP!'
          })
          this.mainLogin = false;
          this.otpStep1 = false;
          this.otpStep2 = false;
          this.forgotEmailStep1 = false;
          this.forgotEmailStep2 = true;
          this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'Email can not empty!'
    }
  }
  resetPassword() {
    this.errorMessage = '';
    if (this.forgotEmail && this.forgetPassEmailOtp && this.newForgetPassword) {
      const formData = {
        "email":this.forgotEmail, 
        "otp":this.forgetPassEmailOtp, 
        "password":this.newForgetPassword
      }
      this._api.setNewPassword(formData).subscribe(
        res => {
          this._loader.startLoader('loader');
          console.log(res);
          this.Toast.fire({
            icon: 'success',
            title: 'Password reset successfull!'
          })
          this._loader.stopLoader('loader');
          window.location.href = environment.projectPath;
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'OTP and New Password required!'
    }
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then( (userData) => {
      let user = {'email': userData.email, 'socialId': userData.id};
      this._api.socialLogin(user).subscribe( 
        res => {
          this._api.storeUserLocally(res.user);
          console.log(res);
          
          this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = err;
          this._loader.stopLoader('loader');
        }
      );
      // this._api.storeUserLocally(userData);
      // this._router.navigate(['/home']);
      console.log('Google login', userData);
      // console.log(user);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (userData) => {
        console.log(userData);
        
      }
    );
  }
}
