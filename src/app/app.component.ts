import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'wevouch';
  public showHeaderFooterSidebar: boolean = false;
  public loginRegistration: boolean = false;
  public userDetails: any = {};
  public notifications: any = []
  constructor(private _router: Router, private _api:ApiService) {
    _router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/registration') {
          this.showHeaderFooterSidebar = false;
          this.loginRegistration = true;
        } else {
          this.showHeaderFooterSidebar = true;
          this.loginRegistration = false;
        }
      }
    });
  }

  ngOnInit(){
    if (!localStorage.getItem('we_vouch_user')) {
      this._router.navigate(['/login']);
    }
    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
    if (this.userDetails) {
      this.getNotifications();
    }
  }

  getNotifications() {
    setInterval(()=>{
      this._api.notificationList(this.userDetails._id).subscribe (
        res => {
          let array = Array()
          for (let index = (res.length-1); index >= 0; index--) {
            array.push(res[index]);
          }
          this.notifications = array;
          // console.log(this.notifications);
        }
      )
    }, 5000);
  }
}
