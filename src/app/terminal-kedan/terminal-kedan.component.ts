import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AvailableService } from '../services/available.service';
import { CashierService } from '../services/cashier.service';
import { SocketioService } from '../services/socketio.service';
import { Howl, Howler } from 'howler';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { AddsService } from '../services/adds.service';
import { ManagementService } from '../services/management.service';
declare var $: any;

@Component({
  selector: 'app-terminal-kedan',
  templateUrl: './terminal-kedan.component.html',
  styleUrls: ['./terminal-kedan.component.css']
})
export class TerminalKedanComponent implements OnInit {

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

  allDataMenu;
  apiLoaded = false;
  id: string = 'YlZAaIc7Y64';

  ads;

  ifHaveOrder: boolean;

  constructor(private socketService: SocketioService, private cashierService: CashierService, private dialog: MatDialog,
    private route: Router, private _snackBar: MatSnackBar, private availableService: AvailableService,
    private changeDetector: ChangeDetectorRef, private adds: AddsService, private managementService: ManagementService) {
    this.getDataAll()
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService
      .getMessages()
      .subscribe((message: string) => {
        console.log(message);
        this.getDataAll()
        // if (message == "00") {
        //   this.getDataAll()
        //   this.openSnackBar("Orderan baru", "x", 1)
        // } if (message == "02") {
        //   this.getDataAll()
        //   this.openSnackBar("Pesanan Selesai", "x", 2)
        // } else {

        // }
      })

    if (!this.apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

    // setTimeout(function () {
    //   $('.list-group').animate({ scrollTop: 0 }, 4000);
    // }, 4000);
    // var scrolltopbottom = setInterval(function () {
    //   // 4000 - it will take 4 secound in total from the top of the page to the bottom
    //   $(".list-group").animate({ scrollTop: $(document).height() }, 4000);
    //   setTimeout(function () {
    //     $('.list-group').animate({ scrollTop: 0 }, 4000);
    //   }, 4000);
    // }, 8000);

    function scrollDown(el) {
      el.animate({
        scrollTop: el[0].scrollHeight
      }, 4000, function () {
        scrollUp(el)
      });
    };

    function scrollUp(el) {
      el.animate({
        scrollTop: 0
      }, 4000, function () {
        scrollDown(el);
      });
    };

    scrollDown($(".list-group"));

    this.adds.getAds().subscribe(res => {
      // console.log(res);
      // this.testData(res)
      if (res.codestatus == "00") {
        this.ads = res.values;
      }
    })


  }



  savePlayer(player) {
    player.target.playVideo()
  }

  stateEvent(state) {
    if (state.data === 0) state.target.playVideo()
  }


  send() {
    // console.log(this.message);
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
    this.getAllDataToday()
  }


  customDialog(icon, message) {
    const dialogConfig = new MatDialogConfig();

    let obj: any = new Object();
    obj.icon = icon;
    obj.message = message;

    dialogConfig.data = obj;
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogCustom = this.dialog.open(
      CustomDialogComponent,
      dialogConfig
    );
    dialogCustom.afterClosed();
  }

  // ==========================================================================
  //                        ON ORDER
  // ==========================================================================

  getAllDataToday() {
    this.managementService.getAllDataToday().subscribe(res => {
      console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnOrder = res['values']
        // console.log(this.listDataOnOrder.length);
        if (this.listDataOnOrder.length > 0) {
          this.ifHaveOrder = true
        } else {
          this.ifHaveOrder = false;
        }

      }
    })
  }



}
