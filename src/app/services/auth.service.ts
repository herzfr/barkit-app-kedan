import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { catchError, tap, timeout, } from 'rxjs/operators';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl;
  private timeOut: number = 30000;

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')

  httpOptions = {
    headers: this.headers_object
  };

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.API_ENDPOINT;
  }



  signin(data: Login) {
    // console.log(this.httpOptions)
    const authObj = JSON.stringify(data);
    // console.log(authObj);
    return this.http.post<any>(this.apiUrl + "/api/auth/signin", authObj, this.httpOptions)
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
