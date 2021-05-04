import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScanOrderComponent } from '../dialog/scan-order/scan-order.component';
import { CashierService } from '../services/cashier.service';
import { SocketioService } from '../services/socketio.service';
import { Howl, Howler } from 'howler';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit {

  message = "01";
  messageList = []

  listDataOnOrder;
  listDataOnWaiting;
  listDataOnReady;

  soundOrder = new Howl({
    src: ['assets/sound/order.mp3']
  });
  soundReady = new Howl({
    src: ['assets/sound/ready.mp3']
  });

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private socketService: SocketioService, private cashierService: CashierService, private dialog: MatDialog,
    private route: Router, private _snackBar: MatSnackBar) {
    this.getUserInfo()
    this.getDataAll()
  }

  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.socketService
      .getMessages()
      .subscribe((message: string) => {
        // console.log(message);
        if (message == "00") {
          this.getDataAll()
          this.openSnackBar("Orderan baru", "x", 1)
        } if (message == "02") {
          this.getDataAll()
          this.openSnackBar("Pesanan Selesai", "x", 2)
        } else {

        }
      });
  }

  send() {
    // // console.log(this.message);
    this.socketService.sendMessage(this.message)
  }

  openSnackBar(message: string, action: string, play: number) {

    switch (play) {
      case 1:
        this.soundOrder.play();
        this._snackBar.open(message, action, {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        break;
      case 2:
        this.soundReady.play();
        this._snackBar.open(message, action, {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        break;
    }

  }

  getDataAll() {
    this.getDataOnOrder()
    this.getDataOnWaiting()
    this.getDataOnReady()
  }

  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  getDataOnOrder() {
    this.cashierService.getDataOnOrder().subscribe(res => {
      // // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnOrder = res['values']
      }
    })
  }

  getDataOnWaiting() {
    this.cashierService.getDataOnWaiting().subscribe(res => {
      // // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnWaiting = res['values']
      }
    })
  }

  getDataOnReady() {
    this.cashierService.getDataOnReady().subscribe(res => {
      // // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnReady = res['values']
      }
    })
  }


  doApprove(id, cashier) {
    // // console.log(id, cashier);
    let obj: any = new Object;
    obj.id = id;
    obj.cashier = cashier;
    this.cashierService.approveOrder(obj).subscribe(res => {
      // // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
        this.send()
      }
    })
  }

  done(id) {
    // // console.log(id);
    let obj: any = new Object;
    obj.id = id;
    this.cashierService.doneOrder(obj).subscribe(res => {
      // // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
      }
    })
  }


  scanOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = "300px";

    const dialogScanQR = this.dialog.open(
      ScanOrderComponent,
      dialogConfig
    );

    dialogScanQR.afterClosed().subscribe(res => {
      if (res !== undefined) {
        let dataScan = JSON.parse(res)
        // // console.log(dataScan);
        this.cashierService.sendOrder(dataScan).subscribe(res => {
          if (res['codestatus'] === "00") {
            this.getDataAll()
            this.send()
          }
        })
      }
    })
  }

  makeAvailable() {
    this.route.navigate(['/available'])
  }

  rejectOrder(id) {
    let obj: any = new Object;
    obj.id = id;
    this.cashierService.doneOrder(obj).subscribe(res => {
      // // console.log(res);
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
