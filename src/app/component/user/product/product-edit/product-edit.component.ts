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
  public uploadedFile1;
  public uploadedFile2;
  public brandName: any = '';
  public modelList: any = '';
  public modelId: any = '';

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
        this.category = res.category;
        this.subCategory = res.subCategory;
        this.modelId = res.modelNo;
        this.purchaseDateTime = getDateFormat(res.purchaseDate);
        // this.fetchSubCategory();
        this.fetchBrands();
        this.invoiceImgUrl = res.invoicePhotoUrl; 
        this.uploadedFile1 = res.invoicePhotoUrl;
        this.productImgUrl = res.productImagesUrl[0]; 
        this.uploadedFile2 = res.productImagesUrl[0];
        console.log(this.purchaseDateTime);
        
      }, err => {}
    );
    // this._api.categoryList().subscribe((res) => {
    //   this.categoriesList = res.filter((t) => t.status === 'active');
    //   this._loader.stopLoader('loader');
    // });
    // this._api.brandList().subscribe((res) => {
    //   this.brandList = res.filter((t) => t.status === 'active');
    // });
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
  
  fetchCategory() {
    console.log(this.brandId);
    this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0].name;
    console.log(this.brandName);
    
    this._api.getProductCategories(this.brandId).subscribe(
      res => {
        this.categoriesList = res.categories;
        console.log(this.categoriesList);
        this.fetchSubCategory();
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
  
  fetchSubCategory() {
    console.log(this.category);
    this._api.getProductSubCategories(this.category).subscribe(
      res => {
        this.subCategoriesList = res.sub_categories;
        // console.log(this.subCategoriesList);
        this.fetchModel();
      }, err => {}
    )
  }

  fetchModel() {
    this._api.getProductModels(this.subCategory).subscribe(
      res => {
        this.modelList = res.models;
        this.modelId = res.models[0].model_no;
        this._loader.stopLoader('loader');
        // console.log(this.modelList);
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
      if (this.category && this.subCategory) {
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
    if (formData.value && formData.value.purchaseDate && formData.value.serialNo && formData.value.warrantyPeriod && formData.value.warrantyType) {
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
      },
      (err) => {
        this.errorMessage = err.error.message;
        this._loader.stopLoader('loader');
      }
    );
  }

}
