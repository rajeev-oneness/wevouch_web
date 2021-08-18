import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-amc-details',
  templateUrl: './amc-details.component.html',
  styleUrls: ['./amc-details.component.css'],
})
export class AmcDetailsComponent implements OnInit {
  public errorMessage: string = '';
  @Output() addAmcDetails = new EventEmitter<any>();
  constructor(private _api: ApiService) {}

  ngOnInit(): void {}

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
