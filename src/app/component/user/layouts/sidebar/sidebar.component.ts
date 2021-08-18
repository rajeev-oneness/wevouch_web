import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public ticketCount : number = 0;
  constructor(private _api: ApiService) { }

  ngOnInit(): void {
    if (localStorage.getItem('we_vouch_user')) {
      const userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
      this._api.ticketList(userDetails._id).subscribe((res) => {
        this.ticketCount = res.length;
      });
    }
  }

}
