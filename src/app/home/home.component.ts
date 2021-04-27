import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message;
  messageList = [];

  cashier: boolean;
  kitchen: boolean;

  constructor(private socketService: SocketioService) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const roles = user['roles'];
    for (const key in roles) {
      if (Object.prototype.hasOwnProperty.call(roles, key)) {
        const element = roles[key];
        switch (element) {
          case 'ROLE_CASHIER':
            this.cashier = true;
            this.kitchen = false;
            break;
          case 'ROLE_KITCHEN':
            this.cashier = false;
            this.kitchen = true;
            break;
        }
      }
    }


  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService
      .getMessages()
      .subscribe((message: string) => {
        console.log(message);
        this.messageList.push(message);
      });
  }

  send() {
    // console.log(this.message);
    this.socketService.sendMessage(this.message)
  }


}
