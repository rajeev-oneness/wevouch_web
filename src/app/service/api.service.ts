import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

var originalURL = environment.apiUrl;
var fileUploadURL = environment.hosted_api_url+"upload.php";
var productAssets = environment.hosted_api_url+"Api.php";
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
    location.reload();
    // this._router.navigate([(routeIntended) ? routeIntended : '/admin/dashboard']);
  }

  storeUserCookie(data, exdays = 7) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = "wevouchUser=" + data + ";" + expires + ";path=/";
  }

  updateUserLocally(data : any){
    localStorage.removeItem('we_vouch_user');
    localStorage.setItem('we_vouch_user',JSON.stringify(data));
  }

  // Logging Out the Current User
  logoutUser():void{
    localStorage.clear();
    window.location.href = environment.projectPath;
    location.reload();
    document.cookie = "wevouchUser=; expires=; path=/;";
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

  socialLogin(formData: any) {
    return this._http.post<any>(_apiUrl+"user/social-login", formData);
  }

  loginWithOtp(formData) {
    return this._http.post<any>(_apiUrl+'user/phone-otp',formData);
  }

  userSignup(formData){
    return this._http.post<any>(_apiUrl+'user/add',formData);
  }

  userAccountVerify(formData) {
    return this._http.post<any>(_apiUrl+'user/verify-phone-email', formData);
  }
  sendSupportMessage(formData: any) {
    return this._http.post<any>(_apiUrl+'user/support/send', formData);
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
  productListByUserAndCategory(formData) {
    return this._http.post<any>(_apiUrl+'product/get-by-category-user', formData);
  }
  allProductList() {
    return this._http.get<any>(_apiUrl+'product/list');
  }

  ticketList(userId) {
    return this._http.get<any>(_apiUrl+'ticket/get-by-user/'+userId);
  }
  ticketListByProduct(productId : any) {
    return this._http.get<any>(_apiUrl+'ticket/get-by-product/'+productId);
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
  addTransaction(formData) {
    return this._http.post<any>( _apiUrl + 'transaction/add' , formData );

  }

  //notification list
  notificationList(userId : any) {
    return this._http.get<any>(_apiUrl+'notification/get-by-user/'+userId);
  }
  addNotification(formData : any) {
    return this._http.post<any>(_apiUrl+'notification/add', formData);
  }

  //address management section
  getAddressList() {
    return this._http.get<any>(_apiUrl+'address/list');
  }
  getAddressListByUser(userId : any) {
    return this._http.get<any>(_apiUrl+'address/get-by-user/'+userId);
  }
  getAddressById(addressId : any) {
    return this._http.get<any>(_apiUrl+'address/get/'+addressId);
  }
  addAddress(formData : any) {
    return this._http.post<any>(_apiUrl+'address/add', formData);
  }
  editAddress(addressId : any, formData : any) {
    return this._http.patch<any>(_apiUrl+'address/update/'+addressId, formData);
  }
  deleteAddressByID(addressId : any) {
    return this._http.delete<any>(_apiUrl+'address/delete/'+addressId);
  }

  //ticket log
  getTicketLog(ticketId : any) {
    return this._http.get<any>(_apiUrl+'ticket-log/get-by-ticket/'+ticketId);
  }

  //support executive
  getSupportExcutives() {
    return this._http.get<any>(_apiUrl+'support-executive/list');
  }
  assignTicketToExecutive(formData : any) {
    return this._http.post<any>(_apiUrl+'ticket/assign-executive', formData);
  }
  changeAllAssignStatus() {
    return this._http.get<any>(_apiUrl+'support-executive/all-assign-status-false');
  }
  changeExecutiveAssignStatus(supportExecId : any, formData : any) {
    return this._http.patch<any>(_apiUrl+'support-executive/change-assign-status/'+supportExecId, formData);
  }

  //forgot password
  forgotPasswordReqSend(formData : any) {
    return this._http.post<any>(_apiUrl+'user/forgot-password', formData);
  }
  setNewPassword(formData : any) {
    return this._http.post<any>(_apiUrl+'user/set-new-password', formData);
  }
  
  //get product assets
  getProductBrands() {
    return this._http.get<any>(productAssets+'?action=fetchBrands');
  }
  getProductCategories(brandId : any) {
    return this._http.get<any>(productAssets+'?action=fetchCategories&brand='+brandId);
  }
  getProductSubCategories(categoryName : any) {
    return this._http.get<any>(productAssets+'?action=fetchSubcategories&category='+categoryName);
  }
  getProductModels(subCategoryName : any) {
    return this._http.get<any>(productAssets+'?action=fetchModels&sub_category='+subCategoryName);
  }
  
  //send mail api
  sendMailApi(formData : any) {
    return this._http.post<any>(_apiUrl+'user/send-email',formData);
  }

  userDetails(userId : any) {
    return this._http.get<any>(_apiUrl+'user/get/'+userId);
  }

  //site/notification settings
  getSettings(userId : any) {
    return this._http.get<any>(_apiUrl+'usersettings/get-by-user/'+userId);
  }
  getSettingsById(settingsId : any) {
    return this._http.get<any>(_apiUrl+'address/update/'+settingsId);
  }
  addSettings(formData : any) {
    return this._http.post<any>(_apiUrl+'usersettings/add', formData);
  }
  editSettings(settingsId : any, formData : any) {
    return this._http.patch<any>(_apiUrl+'usersettings/update/'+settingsId, formData);
  }

  //product icon category wise
  getProductIcon(categoryName : any) {
    return this._http.get<any>(productAssets+'?action=fetchIconCategoryWise&category='+categoryName);
  }

  //fetch cities
  getCities() {
    return this._http.get<any>(productAssets+'?action=fetchCities');
  }

  //get service center brand and city wise
  getServiceCenter(brandId : any, cityName : any) {
    return this._http.get<any>(productAssets+'?action=fetchServiceCenters&brand='+brandId+'&city='+cityName);
  }
  
}
