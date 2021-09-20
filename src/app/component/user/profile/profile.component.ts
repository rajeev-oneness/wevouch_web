import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import  Swal  from "sweetalert2";
import { Location } from "@angular/common";
import { environment } from "src/environments/environment";
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
  public passwordErrorMessage: string = '';
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
  public uploadedFile;
  public profilePicUrl;
  public copyState : boolean = false;


  constructor(
    private _api: ApiService,
    private _loader: NgxUiLoaderService,
    private _router: Router,
    private _location: Location
  ) {}
  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
    this.uploadedFile = this.userDetails.image;
  }

  public fileFormatError = '';
  public selectedFile : File;public hasFile : boolean;
  onSelectFile(event) {
    this._loader.startLoader('loader');
    this.fileFormatError = '';this.hasFile = false;
    this.selectedFile = event.target.files[0];
    if(this.selectedFile != undefined && this.selectedFile != null){
        let validFormat = ['png','jpeg','jpg'];
        let fileName = this.selectedFile.name.split('.').pop();
        let data = validFormat.find(ob => ob === fileName);
        if(data != null || data != undefined){
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.uploadedFile = event.target.result;this.hasFile = true;
            const mainForm = new FormData();
            mainForm.append('file',this.selectedFile);
            console.log(this.selectedFile);
            this._api.storeFile(mainForm).subscribe(
              res => {
                console.log(res);
                this.profilePicUrl = res.file_link;
                this._api.updateUserDetails({'_id': this.userDetails._id,'image':this.profilePicUrl}).subscribe(
                  (res) => {
                    this._api.updateUserLocally(res);
                    this.Toast.fire({
                      icon: 'success',
                      title: 'Profile picture updated successfully!'
                    })
                    this._loader.stopLoader('loader');
                    this.gotToProfile();
                  },
                  (err) => {
                    this.errorMessage = err.error.message;
                    this._loader.stopLoader('loader');
                  }
                );
              }
            )
          }
          return true;
        }
        this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
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
          this.passwordErrorMessage = 'Both passwords cannot be same.';
        } else {
          this.passwordErrorMessage = '';
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
              const notificationForm = {
                "title": "Password Changed", 
                "userId": this.userDetails._id, 
                "description": "Your account password has updated."
              }
              this._api.addNotification(notificationForm).subscribe(
                res=> {console.log(res);}
              );
              this.Toast.fire({
                icon: 'success',
                title: 'Password changed successfully!'
              })
            },
            (err) => {
              this.passwordErrorMessage = err.error.message;
              this._loader.stopLoader('loader');
            }
          );
        }
      } else {
        this.passwordErrorMessage = 'New and Current Password are required';
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
            this.gotToProfile();
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

  gotToProfile() {
    window.location.href = environment.basePath+'user/profile'
  }

  copyReferralCode(copyText : any) {
    navigator.clipboard.writeText(copyText);
    this.copyState = true;
  }

}
