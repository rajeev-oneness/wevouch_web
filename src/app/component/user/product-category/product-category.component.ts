import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import { dateDiffInDays } from "src/app/service/globalFunction";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
})
export class ProductCategoryComponent implements OnInit {
  title = 'ng-carousel-demo';
   
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: true,
    navText:["P<br>R<br>E<br>V","N<br>E<br>X<br>T"],
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true
  }


  public categoryList: any = [];
  public productList: any = [];
  public allProductList: any = [];
  public selectedCategory: string = 'all';
  public userDetails: any = '';
  public dateNow : any = Date.now(); 

  constructor(private _loader: NgxUiLoaderService, private _api: ApiService) {}

  ngOnInit(): void {

    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));

    this._api.productList(this.userDetails._id).subscribe((res) => {
      res.map((item) => {
        item.expiryDate = '';
        if (item.purchaseDate) {
          let purchaseDate = new Date(item.purchaseDate);
          item.expiryDate = purchaseDate.setMonth(purchaseDate.getMonth()+item.warrantyPeriod);
        }
      });
      
      for (let index = 0; index < res.length; index++) {
        let progress = res[index];
        var count=0;
        if (progress['brands'] !='') {
          count = count+1;
        }
        if (progress['category'] !='') {
          count = count+1;
        }
        if (progress['modelNo'] !='') {
          count = count+1;
        }
        if (progress['name'] !='') {
          count = count+1;
        }
        if (progress['purchaseDate'] !='') {
          count = count+1;
        }
        if (progress['registeredMobileNo'] !='') {
          count = count+1;
        }
        if (progress['serialNo'] !='') {
          count = count+1;
        }
        if (progress['subCategory'] !='') {
          count = count+1;
        }
        if (progress['warrantyPeriod'] !='') {
          count = count+1;
        }
        if (progress['invoicePhotoUrl'].length > 0) {
          count = count+1;
        }
        if (progress['productImagesUrl'].length > 0) {
          count = count+1;
        }
        let progressCount=Math.floor((count/11)*100);
        // console.log("progress("+progress.name+"): ", progressCount);
        res[index].progressCount = progressCount;
      }
      this.productList = res.filter((t) => t.status === 'active');
      this.checkingNotification();
      console.log(this.productList);
      
      this._loader.stopLoader('loader');
    });
  }

  checkingNotification() {
    for (let index = 0; index < this.productList.length; index++) {
      if (this.productList[index]?.purchaseDate) {
        let purchaseDate = new Date(this.productList[index].purchaseDate);
        this.productList[index].expiresOn = purchaseDate.setMonth(purchaseDate.getMonth()+this.productList[index].warrantyPeriod);
        let warrantyDaysLeft = dateDiffInDays(this.productList[index].expiresOn, this.dateNow);
        console.log(warrantyDaysLeft+" days left");
        if(warrantyDaysLeft == 30 || warrantyDaysLeft == 15 || warrantyDaysLeft == 3 || warrantyDaysLeft == 0) {
          let title = '';
          let text = '';
          if(warrantyDaysLeft <= 0 ) {
            title = "Warranty expired";
            text = "Warranty of Product "+this.productList[index].name+" has expired.";
          } else {
            title = "Warranty Expiry in "+warrantyDaysLeft+" days";
            text = "Warranty of Product "+this.productList[index].name+" will expire within "+warrantyDaysLeft+" days";
          }
          this.sendNotification(title, text);
        } else {}
      }
      if(this.productList[index]?.amcDetails?.noOfYears) {
        let amcSrtartDate = new Date(this.productList[index].amcDetails.startDate);
        let amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(this.productList[index].amcDetails.noOfYears*12));
        let amcLeftDays = dateDiffInDays(amcValidTill, this.dateNow);
        console.log(amcLeftDays+" days left of amc");
        if(amcLeftDays == 7 || amcLeftDays == 5 || amcLeftDays == 0) {
          let title = '';
          let text = '';
          if(amcLeftDays == 0 ) {
            title = "AMC service expired";
            text = "AMC service of Product "+this.productList[index].name+" has expired.";
          } else {
            title = "AMC service Expiry in "+amcLeftDays+" days";
            text = "AMC service of Product "+this.productList[index].name+" will expire within "+amcLeftDays+" days";
          }
          this.sendNotification(title, text);
        } else {}
      }
      if(this.productList[index]?.extendedWarranty?.noOfYears) {
        let extdWarrantyStart = new Date(this.productList[index].extendedWarranty.startDate);
        let extdWarrantyValidTill = extdWarrantyStart.setMonth(extdWarrantyStart.getMonth()+(this.productList[index].extendedWarranty.noOfYears*12));
        let extdwarrantyLeftDays = dateDiffInDays(extdWarrantyValidTill, this.dateNow);
        console.log(extdwarrantyLeftDays+" days left of Extended warranty");
        if(extdwarrantyLeftDays == 7 || extdwarrantyLeftDays == 0) {
          let title = '';
          let text = '';
          if(extdwarrantyLeftDays == 0 ) {
            title = "Extended warranty expired";
            text = "Extended warranty of Product "+this.productList[index].name+" has expired.";
          } else {
            title = "Extended warranty Expiry in "+extdwarrantyLeftDays+" days";
            text = "Extended warranty of Product "+this.productList[index].name+" will expire within "+extdwarrantyLeftDays+" days";
          }
          this.sendNotification(title, text);
        } else {}
      }
    }
  }


  sendNotification(title : any, description : any){
    const notificationForm = {
      "title": title, 
      "userId": this.userDetails._id, 
      "description": description
    }
    this._api.addNotification(notificationForm).subscribe(
      res=> {console.log(res);}
    );
  }

}
