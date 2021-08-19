import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ActivatedRoute } from "@angular/router";
import { getDateFormat } from 'src/app/service/globalFunction';

@Component({
  selector: 'app-extended-warranty',
  templateUrl: './extended-warranty.component.html',
  styleUrls: ['./extended-warranty.component.css'],
})
export class ExtendedWarrantyComponent implements OnInit {

  public errorMessage: string = '';
  public productId: any = '';
  public productExtWarDetail: any = '';
  public startDateTime: any = '';
  public endDateTime: any = '';

  @Output() addExtendedWarranty = new EventEmitter<any>();
  constructor(private _api: ApiService, private _activated:ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    this._api.getProductDetailsById(this.productId).subscribe(
      res => {
        this.productExtWarDetail = res.extendedWarranty;
        this.startDateTime = getDateFormat(res.extendedWarranty.startDate);
        this.endDateTime = getDateFormat(res.extendedWarranty.endDate);
        console.log(this.startDateTime);
        console.log(this.endDateTime);
        
      }, err => {}
    );
  }

  addWarranty(formData) {
    if (formData?.valid) {
      this.addExtendedWarranty.next(formData.value);
    } else {
      this.errorMessage = ' Please give the required fields';
    }
  }
  skipWarranty() {
    this.addExtendedWarranty.next();
  }
}
