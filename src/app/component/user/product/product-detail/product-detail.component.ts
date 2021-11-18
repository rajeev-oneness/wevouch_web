import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {

  public productId: string;
  public user: any= {};
  public productDetails: any= {};
  public warrantyValidTill : any = '';
  public warrantyDaysLeft : any = '';
  public amcValidTill : any = '';
  public amcLeftDays : any = '';
  public dateNow : any = Date.now(); 
  public tickets : any = []
  public newTickets : any = []
  public ongoingTickets : any = []
  
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: true,
    navText:["Prev","Next"],
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    // nav: true
  }
  constructor(private route: ActivatedRoute, private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { 
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('we_vouch_user') || '{}')
    this._api.userDetails(userData._id).subscribe(
      res => {
        this.user = res;
      }
    )
    this.productId = this.route.snapshot.paramMap.get('productId');
    if(this.productId)
    {
      this._loader.startLoader('loader');
      this._api.getProductDetailsById(this.productId).subscribe(
        res => {
          this.productDetails = res;
          this.productDetails = res;
          let progress = this.productDetails;
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
          this.productDetails.progressCount = progressCount;
          this.warrantyValidTill = '';
          // res.purchaseDate = new Date(res.purchaseDate).toDateString();
          if (res?.purchaseDate) {
            let purchaseDate = new Date(res.purchaseDate);
            purchaseDate.setDate(purchaseDate.getDate()-1);

            this.warrantyValidTill = purchaseDate.setMonth(purchaseDate.getMonth()+res.warrantyPeriod);
            
            this.warrantyDaysLeft = (res.warrantyPeriod > 0) ? dateDiffInDays(this.warrantyValidTill, this.dateNow) : '';
          }
          
          if(res.amcDetails?.noOfYears) {
            let amcSrtartDate = new Date(res.amcDetails.startDate);
            amcSrtartDate.setDate(amcSrtartDate.getDate()-1);

            this.amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(res.amcDetails.noOfYears*12));
            this.amcLeftDays = dateDiffInDays(this.amcValidTill, this.dateNow);
          }
          console.log(this.productDetails);
          
          this._loader.stopLoader('loader');
        }
      )
      this._api.ticketListByProduct(this.productId).subscribe(
        res => {
          console.log(res);
          this.tickets = res;
          this.newTickets = res.filter((t: any) => t.status === 'new');
          this.ongoingTickets = res.filter((t: any) => t.status === 'ongoing');
        }, err => {}
      )
    }
  }

  deleteProduct() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will not recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loader.startLoader('loader');
        this._api.deleteProduct(this.productId).subscribe(
          res => {
            console.log(res);
            const notificationForm = {
              "title": "Product deleted", 
              "userId": this.user._id, 
              "description": "Product "+this.productDetails.name+" has deleted."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
            this._router.navigate(['/user/product/list']);
            this._loader.stopLoader('loader');
          }, err => {}
        )
        Swal.fire(
          'Deleted!',
          'Product has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Product is safe :)',
          'error'
        )
      }
    })
  }

}
