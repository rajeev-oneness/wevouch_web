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
  public warrantyMode: any = 'year';
  public invoiceImgUrl: any = '';
  public productImgUrl: any = '';
  public purchaseDateTime: any = '';
  public uploadedFile1;
  public uploadedFile2;
  public brandName: any = '';
  public modelList: any = '';
  public modelId: any = '';
  public secondTimeCall: boolean = false;
  public warrantyTime: any = '';


  constructor(private _api: ApiService, private _loader: NgxUiLoaderService, private _activated:ActivatedRoute) {
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    // this._loader.startLoader('loader');
    this._api.getProductDetailsById(this.productId).subscribe(
      res => {
        console.log(res);
        this.productDetail = res;
        this.category = res.category;
        this.subCategory = res.subCategory;
        this.modelId = res.modelNo;
        if (res?.purchaseDate) {
          this.purchaseDateTime = getDateFormat(res.purchaseDate);
        }
        this.fetchBrands();

        if(res.warrantyPeriod%12 === 0){
          this.warrantyTime = res.warrantyPeriod/12
        } 
        else {
          this.warrantyTime = res.warrantyPeriod;
          this.warrantyMode = 'month';
        }
        this.invoiceImgUrl = res.invoicePhotoUrl; 
        this.uploadedFile1 = res.invoicePhotoUrl;
        this.productImgUrl = res.productImagesUrl[0]; 
        this.uploadedFile2 = res.productImagesUrl[0];
        console.log(this.purchaseDateTime);
        
      }, err => {}
    );
  }

  fetchBrands() {
    this._api.getProductBrands().subscribe(
      res => {
        // console.log('brands :', res.brands);
        this.brandList = res.brands;
        this.brandId = res.brands.filter((t : any) => t.name === this.productDetail.brands)[0].id;
        console.log(this.brandId);
        this.fetchCategory();
      }, err => {}
    )
  }
  
  fetchCategory(callTime : any = '') {
    console.log(this.brandId);
    this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0].name;
    console.log(this.brandName);
    
    this._api.getProductCategories(this.brandId).subscribe(
      res => {
        this.categoriesList = res.categories;
        if (callTime != '') {
          console.log('brand 2nd');
          this.secondTimeCall = true;
          this.category = this.categoriesList[0].category;
        }
        this.fetchSubCategory();
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
  
  fetchSubCategory(callTime : any = '') {
    console.log('category: ',this.category);
    this._api.getProductSubCategories(this.category).subscribe(
      res => {
        this.subCategoriesList = res.sub_categories;
        console.log(this.subCategoriesList);
        if (callTime != '' || this.secondTimeCall) {
          console.log('category 2nd');
          this.subCategory = this.subCategoriesList[0].sub_category
        }
        this.fetchModel();
      }, err => {}
    )
  }

  fetchModel(callTime : any = '') {
    console.log('Sub category: ',this.subCategory);
    this._api.getProductModels(this.subCategory).subscribe(
      res => {
        this.modelList = res.models;
        if (callTime != '' || this.secondTimeCall) {
          this.modelId = res.models[0].model_no;
        }
        this._loader.stopLoader('loader');
      }
    )
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
  
  
  public fileFormatError = '';
  public selectedFile : File;public hasFile : boolean;
  onSelectFile1(event) {
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
            this.uploadedFile1 = event.target.result;this.hasFile = true;
            const mainForm = new FormData();
            mainForm.append('file',this.selectedFile);
            console.log(this.selectedFile);
            this._api.storeFile(mainForm).subscribe(
              res => {
                console.log(res);
                this.invoiceImgUrl = res.file_link;
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
  
  onSelectFile2(event) {
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
            this.uploadedFile2 = event.target.result;this.hasFile = true;
            const mainForm = new FormData();
            mainForm.append('file',this.selectedFile);
            console.log(this.selectedFile);
            this._api.storeFile(mainForm).subscribe(
              res => {
                console.log(res);
                this.productImgUrl = res.file_link;
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

  showSecondTab(formData) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.category) {
        formData.value.brandId = this.brandName;
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
    if (formData.value) {
      this.addProductValue.purchaseDate = formData.value.purchaseDate;
      this.addProductValue.serialNo = formData.value.serialNo;
      this.addProductValue.modelNo =
        formData.value.modelNo;
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
        const userDetail = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
        const notificationForm = {
          "title": "Product update", 
          "userId": userDetail._id, 
          "description": "Dear "+userDetail.name+", you have successfully updated your product details for "+this.addProductValue.name+"."
        };
        this._api.addNotification(notificationForm).subscribe();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this._loader.stopLoader('loader');
      }
    );
  }

}
