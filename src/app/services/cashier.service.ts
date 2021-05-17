import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { catchError, tap, timeout, } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CashierService {

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

  sendOrder(obj) {

    var headers_object2 = new HttpHeaders()
      .set('Content-Type', 'application/json')

    var httpOptions2 = {
      headers: this.headers_object
    };

    const authObj = JSON.stringify(obj);
    return this.http.post(this.apiUrl + "/api/order", authObj, httpOptions2)
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


  getDataOnOrder() {
    return this.http.get<any>(this.apiUrl + "/api/getOrderOnNew", this.httpOptions)
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


  getDataOnWaiting() {
    return this.http.get<any>(this.apiUrl + "/api/getOrderOnReserve", this.httpOptions)
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


  getDataOnReady() {
    return this.http.get<any>(this.apiUrl + "/api/getOrderOnReady", this.httpOptions)
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


  approveOrder(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/onApproveOrder", authObj, this.httpOptions)
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

  doneOrder(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/onFinishOrder", authObj, this.httpOptions)
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


  rejectOrder(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/onRejectOrder", authObj, this.httpOptions)
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



  sendSelfOrder(obj) {
    const authObj = JSON.stringify(obj);
    return this.http.post(this.apiUrl + "/api/order", authObj, this.httpOptions)
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
