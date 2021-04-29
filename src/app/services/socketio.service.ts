import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;
  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    // console.log(this.socket);

  }

  sendMessage(message) {
    this.socket.emit('my message', message);
  }

  getMessages() {
    return Observable.create((observer) => {
      this.socket.on('my message', (message) => {
        observer.next(message);
      });
    });
  }

}
