import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public _id: string;
  public productDetails: any= {};
  constructor(private route: ActivatedRoute, private _loader:NgxUiLoaderService, private _api:ApiService) { 
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

}
