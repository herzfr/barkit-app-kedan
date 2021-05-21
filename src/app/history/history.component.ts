import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { PaymentDialogComponent } from '../dialog/payment-dialog/payment-dialog.component';
import { Order } from '../models/order';
import { AvailableService } from '../services/available.service';
import { ManagementService } from '../services/management.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild('TABLE') table: ElementRef;

  selected = "2";

  startDate;
  endDate;
  dateThis = new Date();

  isALL: Boolean;
  isPerDay: Boolean;
  isBetween: Boolean;


  displayedColumns = [
    // 'meja',
    'order_id',
    'nama',
    'menu',
    // 'desc',
    // 'onreserve',
    // 'onprosses',
    // 'onready',
    // 'cashier',
    // 'kitchen',
    // 'total',
    // 'discount',
    'grandtotal',
    'payment',
    'balance',
    'status_payment',
    'pay',
  ];
  dataSource: MatTableDataSource<Order>;

  allTotal: number = 0;
  allGrandTotal: number = 0;
  allPayment: number = 0;
  allBalance: number = 0;

  allDataMenu;

  constructor(private route: Router, private managementService: ManagementService, private dialog: MatDialog,
    private availableService: AvailableService) {
    this.getUserInfo()
    // this.setIsALL()
    this.getProduct()
    this.setIsPerday()
  }

  ngOnInit(): void {
  }

  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  setIsALL() {
    this.isALL = true;
    this.isPerDay = false;
    this.isBetween = false;
    this.getDataAll()
  }

  setIsPerday() {
    this.isALL = false;
    this.isPerDay = true;
    this.isBetween = false;
    this.onDataPerDay()
  }

  setIsBetween() {
    this.isALL = false;
    this.isPerDay = false;
    this.isBetween = true;
  }


  goTomenu() {
    this.route.navigate(['/available'])
  }


  getProduct() {
    this.availableService.getAllMenu().subscribe(res => {
      console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
      }
    })
  }

  getDataAll() {
    this.managementService.getDataHistory().subscribe(res => {
      if (res['codestatus'] == "00") {
        // console.log(res['values']);
        this.dataSource = new MatTableDataSource(
          res['values']
        );
        this.getDataTotal()
      }
    })
  }


  searchDataBetween() {
    if (this.startDate !== undefined && this.endDate !== undefined) {
      let obj: any = new Object;
      obj.start = this.startDate;
      obj.end = this.endDate;
      this.managementService.getDataBetween(obj).subscribe(res => {
        if (res['codestatus'] == "00") {
          // console.log(res['values']);
          this.dataSource = new MatTableDataSource(
            res['values']
          );
          this.getDataTotal()
        }
      })
    }
  }

  dateEvent(event) {
    // // console.log(event);
    this.onDataPerDay()
  }

  onDataPerDay() {
    if (this.dateThis !== undefined) {
      let obj: any = new Object;
      obj.date = this.dateThis;
      this.managementService.getDataHistoryPerDay(obj).subscribe(res => {
        if (res['codestatus'] == "00") {
          console.log(res['values']);
          this.dataSource = new MatTableDataSource(
            res['values']
          );
          this.getDataTotal()
        }
      })
    }
  }

  getDataTotal() {
    this.allTotal = 0;
    this.allGrandTotal = 0;
    this.allPayment = 0;
    this.allBalance = 0;
    // console.log(this.dataSource.data);
    this.dataSource.data.forEach(el => {
      // // console.log(el.total);
      // var y: number = + el.total;
      var x: number = + el.grandtotal;
      var a: number = + el.payment;
      var b: number = + el.balance;
      // this.allTotal = this.allTotal + x;
      this.allGrandTotal = this.allGrandTotal + x;
      this.allPayment = this.allPayment + a;
      this.allBalance = this.allBalance + b;
    })

  }

  onChange(event) {
    // // console.log(event);
    this.selected = event.value;
    switch (this.selected) {
      case '1':
        this.setIsALL()
        break;
      case '2':
        this.setIsPerday()
        break;
      case '3':
        this.setIsBetween()
        break;
    }

  }

  EndDateChange(event) {
    // console.log(event.value);
    this.searchDataBetween()
  }

  getNameProduct(id) {
    // console.log(id);
    for (const key in this.allDataMenu) {
      if (Object.prototype.hasOwnProperty.call(this.allDataMenu, key)) {
        const element = this.allDataMenu[key];
        // console.log(element);

        if (id === element.id) return element.name;
      }
    }
  }

  getListWaiting(event) {
    return JSON.parse(event)
  }

  payment(i) {
    console.log(i);

    const dialogConfig2 = new MatDialogConfig();
    // dialogConfig2.data = this.formArray2.controls[i].value;
    dialogConfig2.data = i;
    dialogConfig2.backdropClass = "backdropBackground";
    dialogConfig2.disableClose = true;
    dialogConfig2.minWidth = "min-content";

    const dialogCustom2 = this.dialog.open(
      PaymentDialogComponent,
      dialogConfig2
    );
    dialogCustom2.afterClosed().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        if (res['codestatus'] == "00") {
          this.getDataAll()
          this.customDialog("check_circle", res['message'])
        } else {
          this.customDialog("sms_failed", "update payment gagal")
        }
      }
    })
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
