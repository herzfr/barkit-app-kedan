import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  dataAll;
  categoryl;

  id;
  orderId;

  selectedType;
  menu;
  grandTotal = 0;
  paymentChange = 0;
  balance = 0;
  moneychange = 0;


  constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
    private paymentService: PaymentService, private dialog: MatDialog) {
    console.log(data);
    this.dataAll = data;
    this.id = this.dataAll.id;
    this.orderId = this.dataAll.order_id;
    this.menu = this.dataAll.menu;
    this.grandTotal = this.dataAll.grandtotal;
    this.paymentChange = this.dataAll.payment;
    this.balance = this.dataAll.balance;

    this.paymentService.getCategoryPayment().subscribe(res => {
      if (res['codestatus'] === "00") {
        this.categoryl = res['values']
        // console.log(this.categoryl);
      }
    })

  }

  ngOnInit(): void {
  }

  applyFilter(event) {
    console.log(event);
    var inputPay = parseInt(event)
    // this.paymentChange = this.grandTotal - inputPay;
    if (inputPay >= this.grandTotal) {
      this.paymentChange = this.grandTotal;
      this.balance = this.paymentChange - this.grandTotal;
      this.moneychange = inputPay - this.paymentChange;
    } else {
      this.paymentChange = this.grandTotal - inputPay;
      this.balance = this.grandTotal;
      this.moneychange = inputPay - this.paymentChange;
    }
  }

  onPayment() {

    if (this.selectedType !== undefined) {
      // console.log(this.selectedType);
      let obj: any = new Object;
      obj.id = this.id;
      obj.order_id = this.orderId;
      obj.menu = this.menu;
      obj.grandtotal = this.grandTotal;
      obj.payment = this.paymentChange;
      obj.balance = this.balance;
      obj.type_payment = this.selectedType;
      this.paymentService.updatePayment(obj).subscribe(res => {
        this.dialogRef.close(res)
      })
    } else {
      this.customDialog("sms_failed", "tipe payment tidak boleh kosong")
    }

  }


  onSave() {
    // total: req.body.grandtotal,
    // grandtotal: req.body.grandtotal,
    // payment: req.body.payment,
    // balance: balance,
    // type_payment: req.body.type_payment,
    // status_payment: true,
    // console.log(this.form.get('name').valid);
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

  onNoClick() {
    this.dialogRef.close()
  }

}
