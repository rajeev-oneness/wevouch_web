import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public userId: string;
  public userName: string;
  constructor(
    private _api: ApiService,
    private _loader: NgxUiLoaderService,
    private router: Router
  ) {
    this._loader.startLoader('loader');
  }

  public productList: any = [];

  ngOnInit(): void {
    this._loader.startLoader('loader');
    if (localStorage.getItem('we_vouch_user')) {
      this.userId = JSON.parse(localStorage.getItem('we_vouch_user'))._id;
      this.userName = JSON.parse(localStorage.getItem('we_vouch_user')).name;
      this._api.productList(this.userId).subscribe((res) => {
        this._loader.startLoader('loader');
        const dDate = new Date();
        res.map((item)=>{
          item.differenceInTime = dDate.getTime() - new Date(item.purchaseDate).getTime();
          item.differenceInDays = item.differenceInTime/ (1000 * 3600 * 24);
          item.expiryDate = new Date(dDate.setDate(dDate.getDate()+ item.differenceInDays)).toDateString();
        });
        this.productList = res;
        this._loader.stopLoader('loader');
      });
    }
  }

  deleteProduct(_id) {
    if (_id) {
      this._loader.startLoader('loader');
      this._api.deleteProduct(_id).subscribe((res) => {
        this._api.productList(this.userId).subscribe((res) => {
          console.log(res);
          this.productList = res;
          this._loader.stopLoader('loader');
        });
        const notificationForm = {
          "title": "Product deleted", 
          "userId": this.userId, 
          "description": "Dear "+this.userName+", you have successfully deleted the product."
        }
        this._api.addNotification(notificationForm).subscribe(
          res=> {console.log(res);}
        );
      });
    }
  }

  naviagteToDetails(id) {
    this.router.navigate(['/user/product/detail', id]);
  }
}
