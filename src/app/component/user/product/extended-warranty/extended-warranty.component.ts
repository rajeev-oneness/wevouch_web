import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-extended-warranty',
  templateUrl: './extended-warranty.component.html',
  styleUrls: ['./extended-warranty.component.css'],
})
export class ExtendedWarrantyComponent implements OnInit {
  public errorMessage: string = '';
  @Output() addExtendedWarranty = new EventEmitter<any>();
  constructor(private _api: ApiService) {}

  ngOnInit(): void {}

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
