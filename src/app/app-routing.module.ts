import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./component/user/dashboard/dashboard.component";
import { ProductListComponent } from "./component/user/product/product-list/product-list.component";
import { ProductAddComponent } from "./component/user/product/product-add/product-add.component";
import { ProductDetailComponent } from "./component/user/product/product-detail/product-detail.component";
import { TicketAddComponent } from "./component/user/ticket/ticket-add/ticket-add.component";
import { TicketListComponent } from "./component/user/ticket/ticket-list/ticket-list.component";
import { LoginComponent } from "./component/auth/login/login.component";
import { RegistrationComponent } from "./component/auth/registration/registration.component";
import { ForgetComponent } from "./component/auth/password/forget/forget.component";
import { ChangeComponent } from "./component/auth/password/change/change.component";
import { TicketDetailComponent } from './component/user/ticket/ticket-details/ticket-details.component';
import { ProfileComponent } from './component/user/profile/profile.component';
const routes: Routes = [
  {path : '', component : DashboardComponent, pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'password', children: [
    {path: 'forget', component: ForgetComponent},
    {path: 'change', component: ChangeComponent},
  ]},
  {path: 'user', children: [
    {path : 'dashboard', component : DashboardComponent},
    {path : 'profile', component : ProfileComponent},
    {path: 'product', children: [
      {path: 'list', component: ProductListComponent},
      {path:"add", component:ProductAddComponent},
      {path: 'detail/:productId', component: ProductDetailComponent},
    ]},
    {path: 'ticket', children: [
      {path:"add/:productId", component:TicketAddComponent},
      {path:"list", component:TicketListComponent},
      {path:"detail/:ticketId", component:TicketDetailComponent}
    ]},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
