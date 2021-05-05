import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { ManagementService } from '../services/management.service';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
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

  selected = "1";

  startDate;
  endDate;
  dateThis;

  isALL: Boolean;
  isPerDay: Boolean;
  isBetween: Boolean;


  displayedColumns = ['meja', 'nama', 'menu', 'desc', 'onreserve', 'onprosses', 'onready', 'cashier', 'kitchen', 'total', 'discount', 'grandtotal'];
  dataSource: MatTableDataSource<Order>;

  allTotal: number = 0;
  allGrandTotal: number = 0;

  constructor(private route: Router, private managementService: ManagementService, private dialog: MatDialog) {
    this.getUserInfo()
    this.setIsALL()
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
  }

  setIsBetween() {
    this.isALL = false;
    this.isPerDay = false;
    this.isBetween = true;
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
    // console.log(this.dataSource.data);
    this.dataSource.data.forEach(el => {
      // // console.log(el.total);
      var y: number = + el.total;
      var x: number = + el.grandtotal;
      this.allTotal = this.allTotal + y;
      this.allGrandTotal = this.allGrandTotal + x;
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

