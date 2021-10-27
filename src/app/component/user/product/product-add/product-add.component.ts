import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit {
  public isFirstTab: boolean = true;
  public isSecondTab: boolean = false;
  public isThirdTab: boolean = false;
  public isFourthTab: boolean = false;
  public category: any = null;
  public subCategory: any = null;
  public brandId: string = '';
  public brandName: string = '';
  public modelList: string = '';
  public modelId: any = null;
  public categoriesList: any = [];
  public brandList: any = [];
  public subCategoriesList: any = [];
  public errorMessage: string = '';
  public addProductValue: any = {};
  public isExtendenWarranty: boolean= false;
  public isAmcDetails: boolean = false;
  public invoiceImgUrl: any = new Array();
  public productImgUrl: any = new Array();
  public user: any = {};
  public amcDetailsFill : boolean = true;
  public extWarrantyFill : boolean = true;
  public productImage : boolean = false;
  public purchaseDateField : any = '';
  public serialNoField : any = '';

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService) {
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
    this._loader.startLoader('loader');
    this.fetchBrands();
    this._loader.stopLoader('loader');
  }

  fetchBrands() {
    this._api.getProductBrands().subscribe(
      res => {
        // console.log('brands :', res.brands);
        this.brandList = res.brands;
        // this.brandId = res.brands[0].id;
        this.brandId = null;
        // console.log(this.brandId);
        this.fetchCategory();
      }, err => {}
    )
  }

  fetchCategory() {
    console.log('brand :', this.brandId)
    if (this.brandId !== null) {
      this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0].name;
      console.log(this.brandName);
      
      this._api.getProductCategories(this.brandId).subscribe(
        res => {
          this.categoriesList = res.categories;
          // console.log(this.categoriesList);
          this.category = this.categoriesList[0].category;
          this.fetchSubCategory();
        }, err => {}
      )
    }
    
  }
  
  fetchSubCategory() {
    if (this.category !== null) {
      console.log(this.category);
    
      this._api.getProductSubCategories(this.category).subscribe(
        res => {
          this.subCategoriesList = res.sub_categories;
          // console.log(this.subCategoriesList);
          this.subCategory = this.subCategoriesList[0].sub_category
          this.fetchModel();
        }, err => {}
      )
    }
  }

  fetchModel() {
    if (this.subCategory !== null) {
      this._api.getProductModels(this.subCategory).subscribe(
        res => {
          this.modelList = res.models;
          this.modelId = res.models[0].model_no;
          // console.log(this.modelList);
        }
      )
    }
  }

  public uploadedFile1;
  public uploadedFile2;
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
            this.uploadedFile1 = event.target.result;
            this.hasFile = true;
            const mainForm = new FormData();
            mainForm.append('file',this.selectedFile);
            console.log(this.selectedFile);
            this._api.storeFile(mainForm).subscribe(
              res => {
                this.invoiceImgUrl.push(res.file_link);
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
                this.productImgUrl.push(res.file_link);
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

  addExtendedWarranty(value)
  {
    if(value)
    {
      this.extWarrantyFill = true
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
      this.amcDetailsFill = true;
      this.addProductValue.amcDetails = value;
      console.log(this.addProductValue);

    }
    this.isAmcDetails = false;
    this.isSecondTab= true;
  }
  // fetchSubCategory() {
  //   this._api.subCategoryListByCategoryId(this.category).subscribe((res) => {
  //     this.subCategoriesList = res.filter((t) => t.status === 'active');
  //     this.subCategory = this.subCategoriesList[0]._id
  //   });
  // }
  

  showSecondTab(formData) {
    this.errorMessage = '';
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      // console.log(formData.value.registeredMobileNo.length);
      const phnNum = formData.value.registeredMobileNo.toString();
      if (phnNum.length === 10) {
        if (this.category && this.brandId) {
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
        this.errorMessage = 'Mobile number must be of 10 digits';
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  showExtendenWarranty()
  {
    this.errorMessage = '';

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
    this.errorMessage = '';

    this.isExtendenWarranty = false;
    this.isFirstTab = false;
    this.isSecondTab = false;
    this.isThirdTab = false;
    this.isFourthTab = false;
    this.errorMessage="";
    this.isAmcDetails = true;
  }

  showThirdTab(formData) {
    this.errorMessage = '';
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
        
        if (this.extWarrantyFill === true && this.amcDetailsFill === true) {
          console.log(this.addProductValue);
          this.isSecondTab = false;
          this.isThirdTab = true;
          this.errorMessage = "";
        } else {
          this.errorMessage = "AMC details and Extended Warranty details required";
        }
        this._api.getProductIcon(this.category).subscribe(
          res => {
            console.log('product icon: ',res);
            if(res.message === 'Success') {
              this.productImgUrl.push(environment.hosted_api_url+"icons/"+res.icon.icon);
              this.uploadedFile2 = environment.hosted_api_url+"icons/"+res.icon.icon;
            }
          }
        )
    }
    else
    {
      this.errorMessage = "All fields are required.";
    }
    
  }

  showThankYou() {
    this.errorMessage = "";
    this._loader.startLoader('loader');
    this.addProductValue.productImagesUrl = this.productImgUrl;
    this.addProductValue.userId = JSON.parse(
      localStorage.getItem('we_vouch_user')
    )._id;
    this.addProductValue.invoicePhotoUrl = this.invoiceImgUrl;
    console.log(this.addProductValue);

    this._api.addProduct(this.addProductValue).subscribe(
      (res) => {
        this._loader.stopLoader('loader');
        this.isThirdTab = false;
        this.isFourthTab = true;
        const userDetail = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
        const notificationForm = {
          "title": "Product add", 
          "userId": userDetail._id, 
          "description": "Dear "+userDetail.name+", your product "+this.addProductValue.name+" has successfully been added."
        }
        this._api.addNotification(notificationForm).subscribe();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this._loader.stopLoader('loader');
      }
    );
  }

  removeImage(imageIndex : any) {
    this.productImgUrl.splice(imageIndex, 1);
    console.log(this.productImgUrl);
  }
  removeInvImage(imageIndex : any) {
    this.invoiceImgUrl.splice(imageIndex, 1);
  }
}
