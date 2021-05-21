import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChooseDialogComponent } from '../dialog/choose-dialog/choose-dialog.component';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { AvailableService } from '../services/available.service';
import { CashierService } from '../services/cashier.service';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  loading = false;
  loadingTemplate: TemplateRef<any>;

  allDataMenu: any;
  searchValue;

  allOrderHere = new Array;
  isHaveOrder: boolean = false;

  pajak = 10 / 100;

  total: number = 0;
  totalPajak: number = 0;
  grandTotal: number = 0;

  nama: string;
  desc: string;
  meja: number;
  selects = [];

  constructor(private route: Router, private availableService: AvailableService, private dialog: MatDialog,
    private socketService: SocketioService, private cashierService: CashierService) { }

  ngOnInit(): void {
    this.getUserInfo()
    this.getAllMenu("")
    this.generateTable()
    this.socketService.setupSocketConnection()
  }

  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  clearAll() {
    this.getAllMenu("")
    this.meja = null;
    this.nama = null;
    this.desc = null;
    this.selects = [];
    this.allOrderHere = new Array;
    this.generateTable()
    this.checkBadge()
  }

  generateTable() {
    for (var i = 1; i <= 60; i++) {
      this.selects.push(i);
    }
  }


  checkBadge() {
    // console.log(a);
    if (this.allOrderHere.length > 0) {
      this.isHaveOrder = true;
    } else {
      this.isHaveOrder = false;
    }
    this.checkTotal()
  }


  getAllMenu(search) {
    this.loading = true;
    let obj: any = new Object;
    obj.search = search;
    this.availableService.getAllMenuLike(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
        // console.log(this.form);
        this.loading = false
      }
    })
  }

  getDataImage(event) {
    if (event == "" || event == null) {
      return 'assets/images/sample_minuman.png'
    } else {
      return event;
    }
  }

  applyFilter() {
    this.getAllMenu(this.searchValue)
  }

  choose(event) {
    // console.log(event);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = event;
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogChooseMenu = this.dialog.open(
      ChooseDialogComponent,
      dialogConfig
    );

    dialogChooseMenu.afterClosed().subscribe(res => {
      if (res != undefined) {
        console.log(res);
        this.allOrderHere.push(res)
        // console.log(this.allOrderHere);
        this.checkBadge()
        // localStorage.setItem('cart', JSON.stringify(res));
      }
    })
  }

  delete(event) {
    // console.log(event);
    this.allOrderHere.forEach((item, index) => {
      if (index === event) {
        this.allOrderHere.splice(index, 1);
        this.checkBadge()
      }
    });
  }

  checkTotal() {
    this.total = 0;
    this.totalPajak = 0;
    this.grandTotal = 0;
    if (this.allOrderHere.length > 0) {
      this.allOrderHere.forEach(item => {
        // console.log(item.harga);
        this.total = this.total + (item.harga * item.qty)
      })
      // console.log(this.total);
      this.totalPajak = this.pajak * this.total;
      this.grandTotal = this.total + this.totalPajak;
    }
  }

  clearAllOrder() {
    this.clearAll()
  }



  doOrder() {

    if (this.nama != null && this.meja != null) {
      // console.log("test");

      let infoOrder = new Array;
      // let order: string;

      this.allOrderHere.forEach((item, index) => {
        // infoOrder.push((index + 1) + ". " + item.name + ", qty : " + item.qty);
        let obj: any = new Object;
        obj.id = item.id;
        obj.qty = item.qty;
        obj.discount = 0;
        infoOrder.push(obj);
      });
      // order = infoOrder.map(x => x).join("\n");

      let obj: any = new Object;
      obj.nama = this.nama;
      obj.meja = this.meja;
      obj.menu = JSON.stringify(infoOrder);
      obj.desc = this.desc ? this.desc : "";
      obj.total = this.total;


      console.log(obj);
      // console.log("pesan 1");
      this.cashierService.sendSelfOrder(obj).subscribe(res => {
        if (res['codestatus'] === "00") {
          this.socketService.sendMessage("00")
          this.clearAll()
          this.customDialog("check_circle", res['value'])
        } else {
          this.customDialog("sms_failed", "Gagal Memesan")
        }
      })

    } else {
      const dialogConfig2 = new MatDialogConfig();

      let obj: any = new Object();
      obj.icon = "priority_high";
      obj.message = "Mohon isi nama dan no meja terlebih dahulu";

      dialogConfig2.data = obj;
      dialogConfig2.backdropClass = "backdropBackground";
      dialogConfig2.disableClose = true;
      dialogConfig2.minWidth = "min-content";

      const dialogCustom = this.dialog.open(
        CustomDialogComponent,
        dialogConfig2
      );
      dialogCustom.afterClosed();
    }
  }


  customDialog(icon, message) {

    let obj: any = new Object();
    obj.icon = icon;
    obj.message = message;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = obj;
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = "300px";

    const dialogChooseMenu = this.dialog.open(
      CustomDialogComponent,
      dialogConfig
    );

    dialogChooseMenu.afterClosed()
  }



  back() {
    this.route.navigate(['/home'])
  }



}
