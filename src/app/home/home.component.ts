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

  constructor(private socketService: SocketioService) { }

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
