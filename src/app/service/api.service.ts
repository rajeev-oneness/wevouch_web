import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

var originalURL = environment.apiUrl;
var fileUploadURL = environment.file_upload_url;
var _apiUrl = originalURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private header;

  constructor(private _http : HttpClient,private _router : Router) { 
    this.header = new HttpHeaders()
        // .set("Authorization", 'Bearer ')
        .set("Accept","application/json");
  }
  // How to send the data + Header Example is below
  // return this.http.post<any>(_apiUrl + 'update/user/profile',data,{headers: this.header});

  // Storing the User Info Locally
  storeUserLocally(data : any){
    let routeIntended = localStorage.getItem('routeIntended');
    localStorage.clear();
    // localStorage.setItem('accessToken', 'accessToken1234567890adminWeVouch');
    localStorage.setItem('we_vouch_user',JSON.stringify(data));
    window.location.href = environment.dasboardPath;
    // this._router.navigate([(routeIntended) ? routeIntended : '/admin/dashboard']);
  }

  updateUserLocally(data : any){
    localStorage.removeItem('we_vouch_user');
    localStorage.setItem('we_vouch_user',JSON.stringify(data));
  }

  // Logging Out the Current User
  logoutUser():void{
    localStorage.clear();
    window.location.href = environment.projectPath;
  }

  // Checking the Authentication for User
  isAuthenticated(){
    return !!localStorage.getItem('we_vouch_user');
  }

  getUserDetailsFromStorage(){
    let user = localStorage.getItem('we_vouch_user');
    return JSON.parse(user || '{}');
  }

  storeFile(file) {
    return this._http.post<any>(fileUploadURL, file, {headers: this.header})
  }

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
  updateProdcut(productId, formData){
    return this._http.patch<any>(_apiUrl+'product/update/'+productId, formData);
  }
  getTicketDetailsById(productId){
    return this._http.get<any>(_apiUrl+'ticket/get/'+productId);
  }
  deleteProduct(id)
  {
    return this._http.delete<any>(_apiUrl+'product/delete/'+id);
  }
  deleteTicket(ticketId)
  {
    return this._http.delete<any>(_apiUrl+'ticket/delete/'+ticketId);
  }
  
  //package
  packageList() {
    return this._http.get<any>(_apiUrl+'sub/list');
  }
  packageDetail(subscriptionId :any) {
    return this._http.get<any>( _apiUrl + 'sub/get/' + subscriptionId );
  }

  //notification list
  notificationList(userId : any) {
    return this._http.get<any>(_apiUrl+'notification/get-by-user/'+userId);
    // return this._http.get<any>(_apiUrl+'notification/list');
  }
}
