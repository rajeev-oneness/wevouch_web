import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public productCount: any = '';

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService) { 
    this._loader.startLoader("loader");
  }

  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('we_vouch_user'))._id;
    this._api.productList(userId).subscribe((res) => {
      this.productCount = res.filter((t) => t.status === 'active').length;
      this._loader.stopLoader('loader');
    });
  }

}
