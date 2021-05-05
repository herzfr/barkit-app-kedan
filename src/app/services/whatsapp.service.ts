import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { catchError, tap, timeout, } from 'rxjs/operators';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private apiUrl;
  private timeOut: number = 30000;

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')

  httpOptions = {
    headers: this.headers_object
  };
  socket;
  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = "http://localhost:8080";
  }

  setupSocketConnection() {
    this.socket = io("http://localhost:8080", {
      path: "/socket.io/"
    });
    // console.log(this.socket);
  }

  sendMessage(message) {
    this.socket.emit('qr', message);
  }

  getQr() {
    return Observable.create((observer) => {
      this.socket.on('qr', (message) => {
        observer.next(message);
      });
    });
  }

  getReady() {
    return Observable.create((observer) => {
      this.socket.on('ready', (message) => {
        observer.next(message);
      });
    });
  }

  getAuth() {
    return Observable.create((observer) => {
      this.socket.on('authenticated', (message) => {
        observer.next(message);
      });
    });
  }

  getMessage2() {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  // getMessages() {
  //   return Observable.create((observer) => {
  //     this.socket.on('my message', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }


  getQRCode() {
    return this.http.get<any>(this.apiUrl + "/api/", this.httpOptions)
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
