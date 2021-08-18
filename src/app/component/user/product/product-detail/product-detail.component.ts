import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {

  public _id: string;
  public productDetails: any= {};
  constructor(private route: ActivatedRoute, private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { 
    this._loader.startLoader('loader');
  }

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('productId');
    if(this._id)
    {
      this._loader.startLoader('loader');
      this._api.getProductDetailsById(this._id).subscribe(
        res => {
          res.purchaseDate = new Date(res.purchaseDate).toDateString();
          this.productDetails = res;
          console.log(this.productDetails);
          
          this._loader.stopLoader('loader');
        }
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
        this._api.deleteProduct(this._id).subscribe(
          res => {
            console.log(res);
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
