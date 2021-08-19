import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute } from "@angular/router";
import { getDateFormat } from 'src/app/service/globalFunction';

@Component({
  selector: 'app-amc-details',
  templateUrl: './amc-details.component.html',
  styleUrls: ['./amc-details.component.css'],
})
export class AmcDetailsComponent implements OnInit {
  public errorMessage: string = '';
  public productId: any = '';
  public productAmcDetail: any = '';
  public startDateTime: any = '';

  @Output() addAmcDetails = new EventEmitter<any>();
  constructor(private _api: ApiService, private _activated:ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    this._api.getProductDetailsById(this.productId).subscribe(
      res => {
        this.productAmcDetail = res.amcDetails;
        this.startDateTime = getDateFormat(res.amcDetails.startDate);
        console.log(this.startDateTime);
        
      }, err => {}
    );
  }

  addAmc(formData) {
    if (formData?.valid) {
      this.addAmcDetails.next(formData.value);
    } else {
      this.errorMessage = ' Please give the required fields';
    }
  }
  skipAmcDetails() {
    this.addAmcDetails.next();
  }
}
