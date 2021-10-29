import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  public errorMessage : any = '';
  public userDetail : any = {};
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

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService) {}

  ngOnInit(): void {
    this._loader.startLoader('loader');
    window.scrollTo(0, 0);
    this.userDetail = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
    this._loader.stopLoader('loader');
  }
  sendSupport(formData : any) {
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      console.log(formData.value);
      const mainForm = formData.value;
      this._loader.startLoader('loader');
      this._api.sendSupportMessage(mainForm).subscribe(
        res => {
          console.log(res);
          this.Toast.fire({
            icon: 'success',
            title: 'Message send successfully!'
          })
          formData.controls['subject'].reset();
          formData.controls['text'].reset();
          this._loader.stopLoader('loader');

        },
        err => {
          this.errorMessage = "something went wrong please check credentials and try after sometimes";
          this._loader.stopLoader('loader');
        }
      )
    }else{
      this.errorMessage = 'Please fill out all the details';
    }
  }

}
