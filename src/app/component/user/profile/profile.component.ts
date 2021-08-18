import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {

  public isEdit = false;
  public userDetails: any = {};
  public errorMessage: string = '';
  public successMessage: string = '';
  public password: string = '';
  public newPassword: string = '';
  public passwordType: string = 'password';
  public newPasswordType: string = 'password';
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

  constructor(
    private _api: ApiService,
    private _loader: NgxUiLoaderService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
  }
  togglePasswordType() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  toggleNewPasswordType() {
    this.newPasswordType =
      this.newPasswordType === 'password' ? 'text' : 'password';
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  changePassword() {
    if (this.isEdit) {
      if (this.password && this.newPassword) {
        if (this.password === this.newPassword) {
          this.errorMessage = 'Both passwords cannot be same.';
        } else {
          this.errorMessage = '';
          this._loader.startLoader('loader');
          const toSendData = {
            email: this.userDetails.email,
            password: this.password,
            newPassword: this.newPassword,
          };
          this._api.changePassword(toSendData).subscribe(
            (res) => {
              this._loader.stopLoader('loader');
              this.successMessage = 'Password changed suucessfully.';
              this.Toast.fire({
                icon: 'success',
                title: 'Password changed successfully!'
              })
            },
            (err) => {
              this.errorMessage = err.error.message;
              this._loader.stopLoader('loader');
            }
          );
        }
      } else {
        this.errorMessage = 'New and Current Password are required';
      }
    }
  }

  save() {
    if (this.isEdit) {
      if (this.userDetails.name && this.userDetails.mobile) {
        this.errorMessage = '';
        this._loader.startLoader('loader');
        this._api.updateUserDetails(this.userDetails).subscribe(
          (res) => {
            this._api.updateUserLocally(res);
            this._loader.stopLoader('loader');
            this.Toast.fire({
              icon: 'success',
              title: 'Profile updated successfully!'
            })
          },
          (err) => {
            this.errorMessage = err.error.message;
            this._loader.stopLoader('loader');
          }
        );
      } else {
        this.errorMessage = 'Name and Mobile are required';
      }
    }
  }
}
