import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { Absen } from '../models/absen';
import { AbsenService } from '../services/absen.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-absen',
  templateUrl: './absen.component.html',
  styleUrls: ['./absen.component.css']
})
export class AbsenComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  selected = "1";

  startDate;
  endDate;
  dateThis;

  isALL: Boolean;
  isPerDay: Boolean;
  isBetween: Boolean;

  displayedColumns = ['name', 'status', 'date', 'checkin', 'checkout', 'inlate', 'inOver', 'outlate', 'outOver'];
  dataSource: MatTableDataSource<Absen>;

  allTotal: number = 0;

  constructor(private route: Router, private absenService: AbsenService, private dialog: MatDialog, private datePipe: DatePipe) {
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

  getDataAll() {
    this.absenService.getDataAbsenHistory().subscribe(res => {
      if (res['codestatus'] == "00") {
        console.log(res['values']);
        this.dataSource = new MatTableDataSource(
          res['values']
        );
      }
    })
  }


  searchDataBetween() {
    if (this.startDate !== undefined && this.endDate !== undefined) {
      let obj: any = new Object;
      obj.start = this.startDate;
      obj.end = this.endDate;
      this.absenService.getDataAbsenBetween(obj).subscribe(res => {
        if (res['codestatus'] == "00") {
          console.log(res['values']);
          this.dataSource = new MatTableDataSource(
            res['values']
          );
        }
      })
    }
  }

  dateEvent(event) {
    // console.log(event);
    this.onDataPerDay()
  }

  onDataPerDay() {
    if (this.dateThis !== undefined) {
      var day = this.datePipe.transform(this.dateThis, 'ddMMyyyy');
      let obj: any = new Object;
      obj.date = day;
      this.absenService.getDataAbsenHistoryPerDay(obj).subscribe(res => {
        if (res['codestatus'] == "00") {
          console.log(res['values']);
          this.dataSource = new MatTableDataSource(
            res['values']
          );
        }
      })
    }
  }

  changeDate(event) {
    var dd = event.substring(0, 2)
    var mm = event.substring(2, 4)
    var yyyy = event.substring(4, 8)
    return dd + "/" + mm + "/" + yyyy;
  }

  onChange(event) {
    // console.log(event);
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
    console.log(event.value);
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
      this.absenService.deleteDataAbsenBetween(obj).subscribe(res => {
        if (res['codestatus'] == "00") {
          console.log(res['values']);
          this.dataSource = new MatTableDataSource(
            res['values']
          );
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


  back() {
    this.route.navigate(['/home'])
  }


  goToUser() {
    this.route.navigate(['/management-user'])
  }

}
