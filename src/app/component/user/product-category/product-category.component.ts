import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
})
export class ProductCategoryComponent implements OnInit {
  public categoryList: any = [];
  public productList: any = [];
  public allProductList: any = [];
  public selectedCategory: string = 'all';
  constructor(private _loader: NgxUiLoaderService, private _api: ApiService) {}

  ngOnInit(): void {
    this._api.categoryList().subscribe((res) => {
      this.categoryList = res.filter((t) => t.status === 'active');
    });
    this._api.allProductList().subscribe((res) => {
      const dDate = new Date();
      res.map((item) => {
        item.differenceInTime =
          dDate.getTime() - new Date(item.purchaseDate).getTime();
        item.differenceInDays = item.differenceInTime / (1000 * 3600 * 24);
        item.expiryDate = new Date(
          dDate.setDate(dDate.getDate() + item.differenceInDays)
        ).toDateString();
      });
      this.productList = res.filter((t) => t.status === 'active');
      this.allProductList = this.productList;
    });
  }

  getProductsByCategory(value) {
    if (value === 'all') {
      this.productList = this.allProductList;
      this.selectedCategory = 'all';
    } else {
    //   document.getElementById('other-slider').classList.add('active');
    //   document.getElementById('all-slider').classList.remove('active');
      this.selectedCategory = value.name;
      this._api.productListByCategory(value._id).subscribe((res) => {
        const dDate = new Date();
        res.map((item) => {
          item.differenceInTime =
            dDate.getTime() - new Date(item.purchaseDate).getTime();
          item.differenceInDays = item.differenceInTime / (1000 * 3600 * 24);
          item.expiryDate = new Date(
            dDate.setDate(dDate.getDate() + item.differenceInDays)
          ).toDateString();
        });
        this.productList = res.filter((t) => t.status === 'active');
      });
    }
  }
}
