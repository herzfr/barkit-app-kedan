import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  message;
  messageList = [];

  onWaiting = [
    {
      meja: 1,
      nama: "Dony",
      note: "Gak Pake lama",
      menu: [
        {
          harga: 21000,
          id: 34,
          name: "Mantau Goreng ",
          qty: 2,
        },
        {
          harga: 15000,
          id: 1,
          name: "Espresso",
          qty: 2,
        }
      ],
    },
    {
      meja: 3,
      nama: "Suparman",
      note: "Cabenya Banyakin",
      menu: [
        {
          harga: 21000,
          id: 34,
          name: "Mantau Goreng ",
          qty: 2,
        },
        {
          harga: 15000,
          id: 1,
          name: "Espresso",
          qty: 2,
        }
      ],
    },
    {
      meja: 8,
      nama: "Supryadi",
      note: "Test",
      menu: [
        {
          harga: 21000,
          id: 34,
          name: "Mantau Goreng ",
          qty: 2,
        },
        {
          harga: 15000,
          id: 1,
          name: "Espresso",
          qty: 2,
        }
      ],
    }
  ];

  onDone = [];

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


  doneItem(event) {
    console.log(event);
    this.onWaiting.forEach((item, index) => {
      // console.log(item);
      // console.log(index);
      if (index == event) {
        this.onDone.push(item)
        this.onWaiting.splice(index, 1);
      }
    })
  }

}
