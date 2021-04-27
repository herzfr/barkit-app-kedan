import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { catchError, tap, timeout, } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {

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


  getDataOnProsses() {
    return this.http.get<any>(this.apiUrl + "/api/getOrderOnProsses", this.httpOptions)
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



  proccessOrder(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/onProssesOrder", authObj, this.httpOptions)
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

  readyOrder(data) {
    const authObj = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl + "/api/onReadyOrder", authObj, this.httpOptions)
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

