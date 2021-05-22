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
  inputPay = 0;
  grandTotal = 0;
  paymentChange = 0;
  balance = 0;
  moneychange = 0;


  constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
    private paymentService: PaymentService, private dialog: MatDialog) {
    // console.log(data);
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
    // console.log(event);
    this.inputPay = parseFloat(event)
    this.moneychange = 0;

    if (this.inputPay <= this.grandTotal) {
      // console.log('test 1');
      this.paymentChange = this.inputPay;
      this.balance = this.grandTotal - this.paymentChange
    } else if (this.grandTotal <= this.inputPay) {
      // console.log('test 2');
      this.paymentChange = this.grandTotal;
      this.balance = this.paymentChange - this.grandTotal
      this.moneychange = this.inputPay - this.paymentChange
    } else if (this.inputPay > this.grandTotal) {
      // console.log('test 3');
      // this.paymentChange = this.inputPay;
      // this.moneychange = this.inputPay - this.paymentChange
    } else {
      // console.log('test 4');
      this.paymentChange = 0;
      this.balance = this.grandTotal - this.paymentChange
    }
  }

  onPayment() {
    if (this.selectedType !== undefined && this.inputPay !== 0 && this.balance === 0) {
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
      this.customDialog("sms_failed", "Masukan tipe payment dan input payment terisi, serta pastikan nilai balance 0")
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
