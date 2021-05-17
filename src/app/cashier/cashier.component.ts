import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScanOrderComponent } from '../dialog/scan-order/scan-order.component';
import { CashierService } from '../services/cashier.service';
import { SocketioService } from '../services/socketio.service';
import { Howl, Howler } from 'howler';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { WhatsappIntegratedComponent } from '../dialog/whatsapp-integrated/whatsapp-integrated.component';
import { WhatsappService } from '../services/whatsapp.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';

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


  discountlist = [
    { name: "0%", value: 0 },
    { name: "5%", value: 5 },
    { name: "10%", value: 10 },
    { name: "15%", value: 15 },
    { name: "20%", value: 20 },
    { name: "25%", value: 25 },
    { name: "30%", value: 30 },
    { name: "35%", value: 35 },
    { name: "40%", value: 40 },
    { name: "45%", value: 45 },
    { name: "50%", value: 50 },
    { name: "55%", value: 55 },
    { name: "60%", value: 60 },
    { name: "65%", value: 65 },
    { name: "70%", value: 70 },
    { name: "75%", value: 75 },
  ]

  form: FormGroup;
  formArray: FormArray;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  constructor(private socketService: SocketioService, private cashierService: CashierService, private dialog: MatDialog,
    private route: Router, private _snackBar: MatSnackBar, private waService: WhatsappService, private _formBuilder: FormBuilder) {
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
    this.initFormArray()
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
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnOrder = res['values']

        for (const key in this.listDataOnOrder) {
          if (this.listDataOnOrder.hasOwnProperty(key)) {
            const element = this.listDataOnOrder[key];
            this.addItem(element)
          }
        }
        if (this.listDataOnOrder > 0) this.updateView()

      }
    })
  }

  updateView() {
    this.dataSource.next(this.formArray.controls);
  }

  get formProd(): FormArray {
    return this.form.get('formProd') as FormArray;
  }


  getDataExample(event) {
    // console.log(event);
  }

  getDataOnWaiting() {
    this.cashierService.getDataOnWaiting().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnWaiting = res['values']
      }
    })
  }

  getDataOnReady() {
    this.cashierService.getDataOnReady().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnReady = res['values']
      }
    })
  }


  doApprove(i, user) {
    if (this.formArray.controls[i].get('order_id').valid) {
      // console.log(this.formArray.controls[i].value);
      let obj: any = new Object;
      obj.id = this.formArray.controls[i].get('id').value;
      obj.cashier = user;
      obj.menu = this.formArray.controls[i].get('menu').value
      obj.order_id = this.formArray.controls[i].get('order_id').value
      obj.desc = this.formArray.controls[i].get('desc').value
      obj.total = this.formArray.controls[i].get('total').value
      obj.discount = this.formArray.controls[i].get('discount').value
      obj.grandtotal = this.formArray.controls[i].get('grandtotal').value
      // console.log(obj);
      this.cashierService.approveOrder(obj).subscribe(res => {
        // // console.log(res);
        if (res['codestatus'] === "00") {
          this.getDataAll()
          this.send()
        }
      })
    } else {
      this.customDialog("sms_failed", "order Id tidak boleh kosong")
    }



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


  initFormArray() {
    this.form = this._formBuilder.group({
      formProd: this._formBuilder.array([])
    })
  }

  init(event) {
    // console.log(event);
    let orderFormGroup: FormGroup = new FormGroup({})
    for (const key in event) {
      if (event.hasOwnProperty(key)) {
        const el = event[key];
        // console.log(key, el);
        orderFormGroup.addControl(key, new FormControl(el, Validators.required))
      }
    }
    // console.log(orderFormGroup);
    return orderFormGroup;
  }

  addItem(element) {
    this.formArray = this.form.get('formProd') as FormArray;
    this.formArray.push(this.init(element));
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

  selfOrder() {
    this.route.navigate(['/orderself'])
  }

  rejectOrder(id) {
    let obj: any = new Object;
    obj.id = id;
    this.cashierService.rejectOrder(obj).subscribe(res => {
      // // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
        this.send()
      }
    })
  }


  getRandomString(i) {
    // console.log(i);
    // console.log(this.formArray.controls[i].get('order_id'));
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var oa = 0; oa < 6; oa++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    this.formArray.controls[i].get('order_id').patchValue(result)
    // this.orderId = result;
  }

  discountChange(i) {
    // console.log(event.value, i);
    var total = this.formArray.controls[i].get('total').value;
    var disc = this.formArray.controls[i].get('discount').value;
    var grand = (disc / 100) * total;
    var grandtotal = total - grand;
    this.formArray.controls[i].get('grandtotal').patchValue(grandtotal)
    this.formArray.controls[i].get('grandtotal').updateValueAndValidity()
    // console.log(this.formArray.controls[i].get('grandtotal').value);
  }

  grandTotal(i) {
    // console.log(event.value, i);
    if (this.formArray.controls[i].get('discount').value === null) {
      this.formArray.controls[i].get('discount').patchValue(0)
    }

    var total = this.formArray.controls[i].get('total').value;
    var disc = this.formArray.controls[i].get('discount').value;
    var grand = (disc / 100) * total;
    var grandtotal = total - grand;
    this.formArray.controls[i].get('grandtotal').patchValue(grandtotal)
    this.formArray.controls[i].get('grandtotal').updateValueAndValidity()
    // console.log(this.formArray.controls[i].get('grandtotal').value);
    return this.formArray.controls[i].get('grandtotal').value
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


  historyOrder() {
    this.route.navigate(['/history'])
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['/login'])
  }

}
