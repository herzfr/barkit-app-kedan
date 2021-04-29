import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { catchError, tap, timeout, } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AvailableService {

  private apiUrl;
  private timeOut: number = 30000;

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('x-access-token', this.getToken())

  httpOptions = {
    headers: this.headers_object
  };

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.API_ENDPOINT;
  }

  getToken() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.accessToken;
  }


  getAllMenu() {
    return this.http.get<any>(this.apiUrl + "/api/product", this.httpOptions)
      .pipe(
        // tap(usr => {
        // }),
        timeout(this.timeOut),
        catchError(e => {
          if (e.name === "TimeoutError") {
            // this.showNotification("error", e.message)
          } else if (e.name === "HttpErrorResponse") {
            if (e.status == 401) {
              // this.showNotification("error", e.error.message);
            } else {
              // this.showNotification("error", e.message);
            }
          }
          return of(e);
        })
      )
  }

  getAllMenuLike(obj) {
    const authObj = JSON.stringify(obj);
    return this.http.post<any>(this.apiUrl + "/api/getProductLike", authObj, this.httpOptions)
      .pipe(
        // tap(usr => {
        // }),
        timeout(this.timeOut),
        catchError(e => {
          if (e.name === "TimeoutError") {
            // this.showNotification("error", e.message)
          } else if (e.name === "HttpErrorResponse") {
            if (e.status == 401) {
              // this.showNotification("error", e.error.message);
            } else {
              // this.showNotification("error", e.message);
            }
          }
          return of(e);
        })
      )
  }


  getAllCategory() {
    return this.http.get<any>(this.apiUrl + "/api/categoryProduct", this.httpOptions)
      .pipe(
        // tap(usr => {
        // }),
        timeout(this.timeOut),
        catchError(e => {
          if (e.name === "TimeoutError") {
            // this.showNotification("error", e.message)
          } else if (e.name === "HttpErrorResponse") {
            if (e.status == 401) {
              // this.showNotification("error", e.error.message);
            } else {
              // this.showNotification("error", e.message);
            }
          }
          return of(e);
        })
      )
  }

  updateProduct(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/productAvaliable", authObj, this.httpOptions)
      .pipe(
        // tap(usr => {
        // }),
        timeout(this.timeOut),
        catchError(e => {
          if (e.name === "TimeoutError") {
            // this.showNotification("error", e.message)
          } else if (e.name === "HttpErrorResponse") {
            if (e.status == 401) {
              // this.showNotification("error", e.error.message);
            } else {
              // this.showNotification("error", e.message);
            }
          }
          return of(e);
        })
      )
  }

  addProduct(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/addProduct", authObj, this.httpOptions)
      .pipe(
        // tap(usr => {
        // }),
        timeout(this.timeOut),
        catchError(e => {
          if (e.name === "TimeoutError") {
            // this.showNotification("error", e.message)
          } else if (e.name === "HttpErrorResponse") {
            if (e.status == 401) {
              // this.showNotification("error", e.error.message);
            } else {
              // this.showNotification("error", e.message);
            }
          }
          return of(e);
        })
      )
  }

  updateAvatar(data) {

    var headers_object2 = new HttpHeaders()
      // .set('Content-Type', 'multipart/form-data')
      .set('x-access-token', this.getToken())

    var httpOptions = {
      headers: headers_object2
    };

    const formData: FormData = new FormData();
    formData.append('image', data.avatar);
    formData.append('id', data.id);
    console.log(formData);

    return this.http.post<any>(this.apiUrl + "/api/upload", formData, httpOptions)
      .pipe(
        // tap(usr => {
        // }),
        timeout(this.timeOut),
        catchError(e => {
          if (e.name === "TimeoutError") {
            // this.showNotification("error", e.message)
          } else if (e.name === "HttpErrorResponse") {
            if (e.status == 401) {
              // this.showNotification("error", e.error.message);
            } else {
              // this.showNotification("error", e.message);
            }
          }
          return of(e);
        })
      )
  }


}
