import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {

  constructor(private _loader: NgxUiLoaderService, private _api:ApiService, private _router:Router) { }

  public user : any = '';
  public userSettings : any = {};

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
    this.getSettingByUser(this.user._id);
    
  }

  getSettingByUser(userId :any) {
    this._api.getSettings(userId).subscribe(
      res => {
        console.log('settings',res.length);

        if(res.length === 0) {
          this.userSettings.isWhatsappNotification = false;
          this.userSettings.isEmailNotification = false;
          this.userSettings.isSMSNotification = false;
          this.userSettings.isInAppNotification = false;
          this.userSettings.isEmailNewsLetter = false;
          this.userSettings.isConnectFb = false;
          this.userSettings.isTwoFactorAuth = false;
        } else {
          this.userSettings.isWhatsappNotification = res[0].isWhatsappNotification;
          this.userSettings.isEmailNotification = res[0].isEmailNotification;
          this.userSettings.isSMSNotification = res[0].isSMSNotification;
          this.userSettings.isInAppNotification = res[0].isInAppNotification;
          this.userSettings.isEmailNewsLetter = res[0].isEmailNewsLetter;
          this.userSettings.isConnectFb = res[0].isConnectFb;
          this.userSettings.isTwoFactorAuth = res[0].isTwoFactorAuth;
        }
        console.log(this.userSettings);
        this._loader.stopLoader('loader');
      }
    )
  }

  changeSetting(){
    this._api.getSettings(this.user._id).subscribe(
      res => {
        console.log('settings',res.length);
        console.log('settings',res);
        if(res.length === 0) {
          this.userSettings.userId = this.user._id;
          console.log(this.userSettings);
          this._api.addSettings(this.userSettings).subscribe()
        } else {
          console.log(res[0]._id);
          this.userSettings.userId = this.user._id
          this._api.editSettings(res[0]._id, this.userSettings).subscribe();
        }
      }
    )
  }
  toggle(evt: any){
    console.log(this.userSettings.isWhatsappNotification);
    
  }

}
