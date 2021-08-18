import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

var originalURL = environment.apiUrl;
var _apiUrl = originalURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private header;

  constructor(private _http : HttpClient,private _router : Router) { 
    this.header = new HttpHeaders()
        .set("Authorization", 'Bearer ')
        .set("Accept","application/json");
  }
  // How to send the data + Header Example is below
  // return this.http.post<any>(_apiUrl + 'update/user/profile',data,{headers: this.header});

  userLoginAPI(formData){
    return this._http.post<any>(_apiUrl+'user/login',formData);
  }

  userSignup(formData){
    return this._http.post<any>(_apiUrl+'user/add',formData);
  }

  customerList() {
    return this._http.get<any>(_apiUrl+'user/list',{headers: this.header});
  }
  productList(userId) {
    return this._http.get<any>(_apiUrl+'product/get-by-user/'+userId);
  }
  productListByCategory(categoryId) {
    return this._http.get<any>(_apiUrl+'product/get-by-category/'+categoryId);
  }
  allProductList() {
    return this._http.get<any>(_apiUrl+'product/list');
  }
  ticketList(userId) {
    return this._http.get<any>(_apiUrl+'ticket/get-by-user/'+userId);
  }
  categoryList() {
    return this._http.get<any>(_apiUrl+'category/list');
  }
  subCategoryListByCategoryId(id) {
    return this._http.get<any>(_apiUrl+'sub-category/get-by-category/'+id);
  }
  brandList() {
    return this._http.get<any>(_apiUrl+'brand/list');
  }
  packageList() {
    return this._http.get<any>(_apiUrl+'sub/list');
  }
  addProduct(formData) {
    return this._http.post<any>(_apiUrl+'product/add', formData);
  }
  changePassword(formData) {
    return this._http.post<any>(_apiUrl+'user/change-password', formData);
  }
  updateUserDetails(formData) {
    return this._http.patch<any>(_apiUrl+'user/update/'+formData._id, formData);
  }
  addTicket(formData) {
    return this._http.post<any>(_apiUrl+'ticket/add', formData);
  }
  getProductDetailsById(productId){
    return this._http.get<any>(_apiUrl+'product/get/'+productId);
  }
  getTicketDetailsById(productId){
    return this._http.get<any>(_apiUrl+'ticket/get/'+productId);
  }
  deleteProduct(id)
  {
    return this._http.delete<any>(_apiUrl+'product/delete/'+id);
  }
  
}
