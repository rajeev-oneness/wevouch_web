import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from "@angular/router";
import { getDateFormat } from 'src/app/service/globalFunction';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  public getDateFormat = getDateFormat;

  public isFirstTab: boolean = true;
  public isSecondTab: boolean = false;
  public isThirdTab: boolean = false;
  public isFourthTab: boolean = false;
  public category: string = '';
  public subCategory: string = '';
  public brandId: string = '';
  public categoriesList: any = [];
  public brandList: any = [];
  public subCategoriesList: any = [];
  public errorMessage: string = '';
  public addProductValue: any = {};
  public isExtendenWarranty: boolean= false;
  public isAmcDetails: boolean = false;
  public productId: any = '';
  public productDetail: any = '';
  public warrantyPeriod: any = '';
  public warrantyType: any = '';
  public invoiceImgUrl: any = '';
  public productImgUrl: any = '';
  public purchaseDateTime: any = '';


  constructor(private _api: ApiService, private _loader: NgxUiLoaderService, private _activated:ActivatedRoute) {
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    this._loader.startLoader('loader');
    this._api.getProductDetailsById(this.productId).subscribe(
      res => {
        console.log(res);
        this.productDetail = res;
        this.category = res.category._id;
        this.subCategory = res.subCategory._id;
        this.purchaseDateTime = getDateFormat(res.purchaseDate);
        this.fetchSubCategory();
        // if(res.warrantyPeriod < 12){
        //   this.warrantyType = 'month';
        //   this.warrantyPeriod = res.warrantyPeriod;
        // } else {
        //   this.warrantyPeriod = res.warrantyPeriod;
        //   this.warrantyType = 'year';
        // }
        console.log(this.purchaseDateTime);
        
      }, err => {}
    );
    this._api.categoryList().subscribe((res) => {
      this.categoriesList = res.filter((t) => t.status === 'active');
      this._loader.stopLoader('loader');
    });
    this._api.brandList().subscribe((res) => {
      this.brandList = res.filter((t) => t.status === 'active');
    });
  }



  addExtendedWarranty(value)
  {
    if(value)
    {
      this.addProductValue.extendedWarranty = value;
      console.log(this.addProductValue);

    }
    this.isExtendenWarranty = false;
    this.isSecondTab= true;
  }
  addAmcDetails(value)
  {
    if(value)
    {
      this.addProductValue.amcDetails = value;
      console.log(this.addProductValue);

    }
    this.isAmcDetails = false;
    this.isSecondTab= true;
  }
  fetchSubCategory() {
    this._api.subCategoryListByCategoryId(this.category).subscribe((res) => {
      this.subCategoriesList = res.filter((t) => t.status === 'active');
    });
  }
  
  public uploadedFile;
  public fileFormatError = '';
  public selectedFile : File;public hasFile : boolean;
  onSelectFile(event) {
    this.uploadedFile = '';
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
            this.storeFile(this.selectedFile);
          }
          return true;
        }
        this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
  }
  storeFile(file) {
    const mainForm = new FormData();
    mainForm.append('file',file);
    console.log(file);
    let fileData = file;
    this._api.storeFile(mainForm).subscribe(
      res => {
        console.log(res);
        if(this.isSecondTab === true) {
          this.invoiceImgUrl = res.file_link;
        }
        if(this.isThirdTab === true) {
          this.productImgUrl = res.file_link;
        }
      }
    )
  }

  showSecondTab(formData) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.category && this.subCategory) {
        this.addProductValue = formData.value;
        this.isFirstTab = false;
        this.isSecondTab = true;
        this.errorMessage = "";
        console.log(this.addProductValue);
        
      } else {
        this.errorMessage = 'Please fill out all the details';
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  showExtendenWarranty()
  {
    this.isExtendenWarranty = true;
    this.isFirstTab = false;
    this.isSecondTab = false;
    this.isThirdTab = false;
    this.isFourthTab = false;
    this.errorMessage="";
    this.isAmcDetails = false;
  }
  showAmcDetails()
  {
    this.isExtendenWarranty = false;
    this.isFirstTab = false;
    this.isSecondTab = false;
    this.isThirdTab = false;
    this.isFourthTab = false;
    this.errorMessage="";
    this.isAmcDetails = true;
  }

  showThirdTab(formData) {
    if (formData.value && formData.value.purchaseDate && formData.value.serialNo && formData.value.registeredMobileNo && formData.value.warrantyPeriod && formData.value.warrantyType) {
      this.addProductValue.purchaseDate = formData.value.purchaseDate;
      this.addProductValue.serialNo = formData.value.serialNo;
      this.addProductValue.registeredMobileNo =
        formData.value.registeredMobileNo;
      if (formData.value.warrantyType === 'year') {
        this.addProductValue.warrantyPeriod =
          Number(formData.value.warrantyPeriod) * 12;
      } else {
        this.addProductValue.warrantyPeriod =
          formData.value.warrantyPeriod || 0;
      }
      console.log(this.addProductValue);

      this.isSecondTab = false;
      this.isThirdTab = true;
      this.errorMessage = "";
    }
    else
    {
      this.errorMessage = "All fields are required.";
    }
  }

  showThankYou() {
    this._loader.startLoader('loader');
    this.addProductValue.productImagesUrl = [
      this.productImgUrl,
    ];
    this.addProductValue.userId = JSON.parse(
      localStorage.getItem('we_vouch_user')
    )._id;
    this.addProductValue.invoicePhotoUrl = this.invoiceImgUrl;
    console.log(this.addProductValue);

    this._api.updateProdcut( this.productId, this.addProductValue).subscribe(
      (res) => {
        this._loader.stopLoader('loader');
        this.isThirdTab = false;
        this.isFourthTab = true;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this._loader.stopLoader('loader');
      }
    );
  }

}
