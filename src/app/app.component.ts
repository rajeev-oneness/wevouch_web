import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'wevouch';
  public showHeaderFooterSidebar: boolean = false;
  public loginRegistration: boolean = false;

  constructor(private _router: Router) {
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
  }
}
