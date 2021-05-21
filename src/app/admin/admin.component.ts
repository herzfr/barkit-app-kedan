import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { ManagementService } from '../services/management.service';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { AvailableService } from '../services/available.service';
import { PaymentService } from '../services/payment.service';
// const ALL_BOOKS: Book[] = [
//   { value: 1, name: 'All' },
//   { value: 2, name: 'Per Day' },
//   { value: 3, name: 'Today'},
// ];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
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
    'onreserve',
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
    'type_payment',
    'createdAt',
  ];
  dataSource: MatTableDataSource<Order>;

  allTotal: number = 0;
  allGrandTotal: number = 0;
  allPayment: number = 0;
  allBalance: number = 0;

  allDataMenu;
  categoryl;

  constructor(private route: Router, private managementService: ManagementService, private dialog: MatDialog,
    private availableService: AvailableService, private paymentService: PaymentService) {
    this.getUserInfo()
    this.getProduct()
    this.getPaymentType()
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

  getProduct() {
    this.availableService.getAllMenu().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
      }
    })
  }

  getPaymentType() {
    this.paymentService.getCategoryPayment().subscribe(res => {
      // console.log(res['values']);

      if (res['codestatus'] === "00") {
        this.categoryl = res['values']
        // console.log(this.categoryl);
      }
    })
  }

  setPaymentType(type) {
    return this.categoryl.find(x => x.id === type).name;
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


  goTomenu() {
    this.route.navigate(['/available'])
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
          // console.log(res['values']);
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

  logout() {
    localStorage.clear()
    this.route.navigate(['/login'])
  }


  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }


  changeDate(event) {
    var dd = event.substring(0, 2)
    var mm = event.substring(2, 4)
    var yyyy = event.substring(4, 8)
    return dd + "/" + mm + "/" + yyyy;
  }


  deleteAllBetween() {
    if (this.startDate !== undefined && this.endDate !== undefined) {
      let obj: any = new Object;
      obj.start = this.startDate;
      obj.end = this.endDate;
      this.managementService.deleteDataBetween(obj).subscribe(res => {
        if (res['codestatus'] == "00") {
          // console.log(res['values']);
          this.dataSource = new MatTableDataSource(
            res['values']
          );
          this.getDataTotal()
          this.customDialog("check_circle", res['message'])
        }
      })
    } else {
      this.customDialog("sms_failed", "Tanggal mulai dan akhir tidak ada")
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


  absenManagement() {
    this.route.navigate(['management-absen'])
  }

  addsManagement() {
    this.route.navigate(['management-adds'])
  }

}

