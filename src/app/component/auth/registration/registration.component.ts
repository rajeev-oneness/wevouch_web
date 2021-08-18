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
  ngOnInit(): void {
    this._loader.stopLoader('loader');
  }

  userSignupSubmit(formData) {
    this.errorMessage = '';
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (formData.value.password === formData.value.conPassword) {
        this._loader.startLoader('loader');
        formData.value.mobile="1234567890";
        this._api.userSignup(formData.value).subscribe(
          (res) => {
            this._loader.stopLoader('loader');
            this._router.navigate(['/login']);
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
}
