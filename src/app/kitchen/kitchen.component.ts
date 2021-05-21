import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { KitchenService } from '../services/kitchen.service';
import { SocketioService } from '../services/socketio.service';
import { Howl, Howler } from 'howler';
import { AvailableService } from '../services/available.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  message = "02";
  messageList = [];

  listDataOnWaiting;
  listDataOnProsses;

  soundReady = new Howl({
    src: ['assets/sound/ready.mp3']
  });

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  allDataMenu;

  constructor(private socketService: SocketioService, private kitchenService: KitchenService, private route: Router,
    private _snackBar: MatSnackBar, private availableService: AvailableService) {
    this.getUserInfo()
    this.getDataAll()
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService
      .getMessages()
      .subscribe((message: string) => {
        if (message === "01") {
          this.getDataAll()
          this.openSnackBar("Pesanan baru dari kasir", "x")
        }
        // console.log(message);
        // this.messageList.push(message);

      });
  }

  send(data) {
    // console.log(this.message);
    this.socketService.sendMessage(data)
  }

  getDataAll() {
    this.getProduct()
    this.getDataOnWaiting()
    this.getDataOnProsses()
  }


  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  openSnackBar(message: string, action: string) {
    this.soundReady.play();
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
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

  getListWaiting(event) {
    return JSON.parse(event)
  }

  getNameProduct(id) {
    // console.log(id);
    for (const key in this.allDataMenu) {
      if (Object.prototype.hasOwnProperty.call(this.allDataMenu, key)) {
        const element = this.allDataMenu[key];
        if (id === element.id) return element.name;
      }
    }
  }

  getProduct() {
    this.availableService.getAllMenu().subscribe(res => {
      console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
      }
    })
  }



  doProccess(id, kitchen) {
    // console.log(id, kitchen);
    let obj: any = new Object;
    obj.id = id;
    obj.kitchen = kitchen;
    this.kitchenService.proccessOrder(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
        this.send("03")
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
        this.send("02")
      }
    })
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['/login'])
  }

}
