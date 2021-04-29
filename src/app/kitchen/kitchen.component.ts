import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KitchenService } from '../services/kitchen.service';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  message = "00";
  messageList = [];

  listDataOnWaiting;
  listDataOnProsses;


  constructor(private socketService: SocketioService, private kitchenService: KitchenService, private route: Router) {
    this.getUserInfo()
    this.getDataAll()
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService
      .getMessages()
      .subscribe((message: string) => {
        // console.log(message);
        this.messageList.push(message);
        this.getDataAll()
      });
  }

  send() {
    // console.log(this.message);
    this.socketService.sendMessage(this.message)
  }

  getDataAll() {
    this.getDataOnWaiting()
    this.getDataOnProsses()
  }


  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  getDataOnWaiting() {
    this.kitchenService.getDataOnWaiting().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnWaiting = res['values']
      }
    })
  }

  getDataOnProsses() {
    this.kitchenService.getDataOnProsses().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnProsses = res['values']
      }
    })
  }

  doProccess(id, cashier) {
    // console.log(id, cashier);
    let obj: any = new Object;
    obj.id = id;
    obj.cashier = cashier;
    this.kitchenService.proccessOrder(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
        this.send()
      }
    })
  }

  doneProccess(id) {
    // console.log(id);
    let obj: any = new Object;
    obj.id = id;
    this.kitchenService.readyOrder(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
        this.send()
      }
    })
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['/login'])
  }

}
