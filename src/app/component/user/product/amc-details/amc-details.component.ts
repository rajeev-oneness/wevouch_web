import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute } from "@angular/router";
import { getDateFormat } from 'src/app/service/globalFunction';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-amc-details',
  templateUrl: './amc-details.component.html',
  styleUrls: ['./amc-details.component.css'],
})
export class AmcDetailsComponent implements OnInit {
  public errorMessage: string = '';
  public productId: any = '';
  public productAmcDetail: any = {};
  public startDateTime: any = '';

  @Output() addAmcDetails = new EventEmitter<any>();
  constructor(private _api: ApiService, private _activated:ActivatedRoute, private _loader:NgxUiLoaderService) {}

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    if(this.productId) {
      this._api.getProductDetailsById(this.productId).subscribe(
        res => {
          this.productAmcDetail = res.amcDetails;
          this.amcImgUrl = res.amcDetails?.amcImages;
          this.startDateTime = getDateFormat(res.amcDetails.startDate);
          console.log(this.startDateTime);
          
        }, err => {}
      );
    }
  }

  public uploadedFile;
  public amcImgUrl : any = new Array();
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
            this.uploadedFile = event.target.result;
            this.hasFile = true;
            const mainForm = new FormData();
            mainForm.append('file',this.selectedFile);
            console.log(this.selectedFile);
            this._api.storeFile(mainForm).subscribe(
              res => {
                this.amcImgUrl.push(res.file_link);
                this._loader.stopLoader('loader');
              }
            )
          }
          return true;
        }
        this.fileFormatError = 'This File Format is not accepted';
        this._loader.stopLoader('loader');
    }
    return false;
  }

  removeInvImage(imageIndex : any) {
    this.amcImgUrl.splice(imageIndex, 1);
    console.log(this.amcImgUrl);
  }

  addAmc(formData) {
    if (formData?.valid) {
      const phnNum = formData.value.mobileNo.toString();
      if (phnNum.length === 10) {
        let mainForm = formData.value;
        mainForm.amcImages = this.amcImgUrl;
        this.addAmcDetails.next(mainForm);
      } else {
        this.errorMessage = ' Mobile number must be ogf 10 digits';
      }
    } else {
      this.errorMessage = ' Please give the required fields';
    }
  }
  skipAmcDetails() {
    this.addAmcDetails.next();
  }
}
