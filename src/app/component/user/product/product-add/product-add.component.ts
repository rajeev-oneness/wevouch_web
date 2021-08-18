import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService) {
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this._loader.startLoader('loader');
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
    }
    this.isExtendenWarranty = false;
    this.isSecondTab= true;
  }
  addAmcDetails(value)
  {
    if(value)
    {
      this.addProductValue.amcDetails = value;
    }
    this.isAmcDetails = false;
    this.isSecondTab= true;
  }
  fetchSubCategory() {
    this._api.subCategoryListByCategoryId(this.category).subscribe((res) => {
      this.subCategoriesList = res.filter((t) => t.status === 'active');
    });
  }
  

  showSecondTab(formData) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.category && this.brandId && this.subCategory) {
        this.addProductValue = formData.value;
        this.isFirstTab = false;
        this.isSecondTab = true;
        this.errorMessage = "";
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
      'https://i.pinimg.com/originals/e4/bd/7f/e4bd7fcfa7cab450251ed1208df4a88a.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdIEHk92xSe6iKOFKZmijD4DwBVkMMbFGFCA&usqp=CAU',
    ];
    this.addProductValue.userId = JSON.parse(
      localStorage.getItem('we_vouch_user')
    )._id;
    this.addProductValue.invoicePhotoUrl = 'jjkfhg';
    this._api.addProduct(this.addProductValue).subscribe(
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
