import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  constructor(
    private _api: ApiService,
    private _loader: NgxUiLoaderService,
    private _router: Router
  ) {
    this._loader.startLoader('loader');
  }
  public errorMessage = '';
  public confirmPassword : any = '';
  public mainSignupForm : boolean = true;
  public accountConfirmation : boolean = false;
  public userEmail : any = '';
  public firstNameVal : any = '';
  public lastNameVal : any = '';
  public restrictedAge : number ;

  ngOnInit(): void {
    this._loader.stopLoader('loader');
  }

  userSignupSubmit(formData) {
    this.errorMessage = '';
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (formData.value.password === this.confirmPassword) {
        this._loader.startLoader('loader');
        let mainForm = formData.value;
        mainForm.name = this.firstNameVal+' '+this.lastNameVal;
        mainForm.image = 'https://ui-avatars.com/api/?background=random&name='+formData.value.name;
        this._api.userSignup(mainForm).subscribe(
          (res) => {
            const notificationForm = {
              "title": "Free Ticket Earn", 
              "userId": res.user._id, 
              "description": "You earn "+res.user.subscription.ticketCount+" tickets."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
            this.userEmail = res.user.email;
            if(res.user.is_email_verified === true && res.user.is_mobile_verified === true) {
              this._api.storeUserLocally(res.user);
              this._router.navigate(['/login']);
            } else {
              this.accountConfirmation = true;
              this.mainSignupForm = false;
            }
            
            this._loader.stopLoader('loader');
          },
          (err) => {
            this.errorMessage = err.error.message;
            this._loader.stopLoader('loader');
          }
        );
      } else {
        this.errorMessage = 'Password and Confirm Password does not match';
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    // console.log('Form Data SUbmitted');
  }
  
  confirmPasswordCheck(e :any) {
    this.confirmPassword = e.target.value;
  }

  verifyAccount(formData) {
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      mainForm.email = this.userEmail;
      this._api.userAccountVerify(mainForm).subscribe(
        res => {
          console.log(res);
          this._api.storeUserLocally(res.data);
          this._router.navigate(["/user/dashboard"]);
          this.accountConfirmation = false;
          this.mainSignupForm = true;
        }, err => {
          this.errorMessage = "Something went wrong!";
        }
      )
      this._loader.stopLoader("loader");
    }
    
  }
}
