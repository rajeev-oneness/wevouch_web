import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./component/user/dashboard/dashboard.component";
import { ProductListComponent } from "./component/user/product/product-list/product-list.component";
import { ProductAddComponent } from "./component/user/product/product-add/product-add.component";
import { ProductDetailComponent } from "./component/user/product/product-detail/product-detail.component";
import { ProductEditComponent } from "./component/user/product/product-edit/product-edit.component";
import { TicketAddComponent } from "./component/user/ticket/ticket-add/ticket-add.component";
import { TicketListComponent } from "./component/user/ticket/ticket-list/ticket-list.component";
import { LoginComponent } from "./component/auth/login/login.component";
import { RegistrationComponent } from "./component/auth/registration/registration.component";
import { ForgetComponent } from "./component/auth/password/forget/forget.component";
import { ChangeComponent } from "./component/auth/password/change/change.component";
import { TicketDetailComponent } from './component/user/ticket/ticket-details/ticket-details.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { PackageListComponent } from "./component/user/package/package-list/package-list.component";
import { AuthGuardService } from "./service/auth-guard.service";
import { NotificationSettingsComponent } from './component/user/notification-settings/notification-settings.component';
import { ProductsComponent } from './component/user/product/products/products.component';

import { AddressListComponent } from "./component/user/address/address-list/address-list.component";

const routes: Routes = [
  {path : '', component : DashboardComponent, pathMatch:'full', canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'password', canActivate: [AuthGuardService], children: [
    {path: 'forget', component: ForgetComponent},
    {path: 'change', component: ChangeComponent},
  ]},
  {path: 'user', canActivate: [AuthGuardService], children: [
    {path : 'dashboard', component : DashboardComponent},
    {path : 'profile', component : ProfileComponent},
    {path: 'product', children: [
      {path: 'list', component: ProductsComponent},
      {path:"add", component:ProductAddComponent},
      {path: 'edit/:productId', component: ProductEditComponent},
      {path: 'detail/:productId', component: ProductDetailComponent},
      {path:"products", component:ProductsComponent},
    ]},
    {path: 'ticket', children: [
      {path:"add/:productId", component:TicketAddComponent},
      {path:"list", component:TicketListComponent},
      {path:"detail/:ticketId", component:TicketDetailComponent}
    ]},
    {path: 'address', children: [
      {path:"list", component:AddressListComponent}
    ]},
    {path: 'package', children: [
      {path:"list", component:PackageListComponent},
    ]},
    {path: 'notification-settings', component:NotificationSettingsComponent},
  ]},
  {path : '**', component : DashboardComponent, pathMatch:'full',canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
