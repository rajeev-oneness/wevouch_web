import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { Location } from "@angular/common";
import { Route } from '@angular/compiler/src/core';
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  
  @ViewChild('closebutton') closebutton;
  @ViewChild('addressForm') addressForm;

  public user : any = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
  public userAddresses : any = []
  public addressData : any = {}
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
  public errorMessage : any = ''
  public addressId : any = ''
  public formType : any = 'addForm'

  constructor(private _loader: NgxUiLoaderService, private _api: ApiService, private _location: Location, private _router: Router) { }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this._loader.startLoader('loader');
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

  back() {
    // this._location.back();
    this._router.navigate(['/profile/details'])
  }

  delteAddress(addressId : any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This address will not recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loader.startLoader('loader');
        this._api.deleteAddressByID(addressId).subscribe(
          res => {
            this.getAddressData()
          }, err => {}
        )
        Swal.fire(
          'Deleted!',
          'Address has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Address is safe :)',
          'error'
        )
      }
    })
  }

  fetchAddressData(addressId : any) {
    this.addressId = addressId;
    this.formType = 'editForm';
    this._api.getAddressById(addressId).subscribe(
      res => {
        this._loader.startLoader('loader');
        this.addressData = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
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
      if(this.formType === 'addForm') {
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
            this.errorMessage = 'Something went wrong!';
          }
        )
      }
      if(this.formType === 'editForm') {
        this._api.editAddress(this.addressId ,mainForm).subscribe(
          res => {
            this.closeModal();
            this._loader.startLoader('loader');
            this.Toast.fire({
              icon: 'success',
              title: 'Address updated successfully!'
            })
            this.getAddressData();
            this.emptyModal();
            this._loader.stopLoader('loader');
          }, err => {
            this.errorMessage = 'Something went wrong!';
          }
        )
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
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
