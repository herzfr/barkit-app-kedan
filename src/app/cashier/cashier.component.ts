import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AvailableService } from '../services/available.service';
import { MenuDialogComponent } from '../dialog/menu-dialog/menu-dialog.component';
import { PaymentDialogComponent } from '../dialog/payment-dialog/payment-dialog.component';
declare var $: any;

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit, AfterContentChecked {

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


  // discountlist = [
  //   { name: "0%", value: 0 },
  //   { name: "5%", value: 5 },
  //   { name: "10%", value: 10 },
  //   { name: "15%", value: 15 },
  //   { name: "20%", value: 20 },
  //   { name: "25%", value: 25 },
  //   { name: "30%", value: 30 },
  //   { name: "35%", value: 35 },
  //   { name: "40%", value: 40 },
  //   { name: "45%", value: 45 },
  //   { name: "50%", value: 50 },
  //   { name: "55%", value: 55 },
  //   { name: "60%", value: 60 },
  //   { name: "65%", value: 65 },
  //   { name: "70%", value: 70 },
  //   { name: "75%", value: 75 },
  // ]

  form: FormGroup;
  formArray: FormArray;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  // form2: FormGroup;
  // formArray2: FormArray;
  // dataSource2: any = new BehaviorSubject<AbstractControl[]>([]);

  allDataMenu;

  constructor(private socketService: SocketioService, private cashierService: CashierService, private dialog: MatDialog,
    private route: Router, private _snackBar: MatSnackBar, private waService: WhatsappService, private _formBuilder: FormBuilder,
    private availableService: AvailableService, private changeDetector: ChangeDetectorRef) {
    this.getUserInfo()
    this.getDataAll()
  }

  // ==========================================================================
  //                        UNIVERSAL FUNCTION
  // ==========================================================================

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
    // throw new Error('Method not implemented.');
  }
  // markForCheck(): void {
  //   // throw new Error('Method not implemented.');
  // }
  // detach(): void {
  //   // throw new Error('Method not implemented.');
  // }
  // detectChanges(): void {
  //   // throw new Error('Method not implemented.');
  // }
  // checkNoChanges(): void {
  //   // throw new Error('Method not implemented.');
  // }
  // reattach(): void {
  //   // throw new Error('Method not implemented.');
  // }

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
    this.getProduct()
    this.initFormArray()
    // this.initFormArray2()
    this.getDataOnOrder()
    this.getDataOnWaiting()
    this.getDataOnReady()
  }

  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }


  getProduct() {
    this.availableService.getAllMenu().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
      }
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
        // console.log(dataScan);
        this.cashierService.sendOrder(dataScan).subscribe(res => {
          if (res['codestatus'] === "00") {
            this.getDataAll()
            this.send()
          }
        })
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
    // console.log(i);
    var total = this.formArray.controls[i].get('total').value;
    var disc = this.formArray.controls[i].get('discount').value;
    var grand = (disc / 100) * total;
    var grandtotal = total - grand;
    this.formArray.controls[i].get('grandtotal').patchValue(grandtotal)
    this.formArray.controls[i].get('grandtotal').updateValueAndValidity()
    // console.log(this.formArray.controls[i].get('grandtotal').value);
  }

  // grandTotal(i) {
  //   // console.log(i);
  //   if (this.formArray.controls[i].get('discount').value === null) {
  //     this.formArray.controls[i].get('discount').patchValue(0)
  //   }

  //   var total = this.formArray.controls[i].get('total').value;
  //   var disc = this.formArray.controls[i].get('discount').value;
  //   var grand = (disc / 100) * total;
  //   var grandtotal = total - grand;
  //   this.formArray.controls[i].get('grandtotal').patchValue(grandtotal)
  //   this.formArray.controls[i].get('grandtotal').updateValueAndValidity()
  //   // console.log(this.formArray.controls[i].get('grandtotal').value);
  //   return this.formArray.controls[i].get('grandtotal').value
  // }

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

  getNameProduct(id) {
    // console.log(id);
    for (const key in this.allDataMenu) {
      if (Object.prototype.hasOwnProperty.call(this.allDataMenu, key)) {
        const element = this.allDataMenu[key];
        if (id === element.id) return element.name;
      }
    }
  }

  getNameProduct2(id) {
    // console.log(id);
    for (const key in this.allDataMenu) {
      if (Object.prototype.hasOwnProperty.call(this.allDataMenu, key)) {
        const element = this.allDataMenu[key];
        if (id === element.id) return element.name;
      }
    }
  }

  // ==========================================================================
  //                        ON ORDER
  // ==========================================================================

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

  initFormArray() {
    this.form = this._formBuilder.group({
      formProd: this._formBuilder.array([]),
      // formProd2: this._formBuilder.array([])
    })
  }

  addItem(element) {
    this.formArray = this.form.get('formProd') as FormArray;
    this.formArray.push(this.init(element));
  }

  updateView() {
    this.dataSource.next(this.formArray.controls);
  }

  get formProd(): FormArray {
    return this.form.get('formProd') as FormArray;
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
      obj.total = this.formArray.controls[i].get('grandtotal').value
      obj.discount = this.formArray.controls[i].get('discount').value
      obj.grandtotal = this.formArray.controls[i].get('grandtotal').value
      obj.payment = this.formArray.controls[i].get('payment').value
      obj.balance = this.formArray.controls[i].get('balance').value
      // console.log(obj);
      this.cashierService.approveOrder(obj).subscribe(res => {
        // console.log(res);
        if (res['codestatus'] === "00") {
          this.getDataAll()
          this.send()
        }
      })
    } else {
      this.customDialog("sms_failed", "order Id tidak boleh kosong")
    }
  }

  rejectOrder(id) {
    let obj: any = new Object;
    obj.id = id;
    this.cashierService.rejectOrder(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
        this.send()
      }
    })
  }

  getBalance(i) {
    var total = this.formArray.controls[i].get('grandtotal').value;
    var payment = this.formArray.controls[i].get('payment').value;
    var balance = total - payment;

    this.formArray.controls[i].get('balance').patchValue(balance)
    this.formArray.controls[i].get('balance').updateValueAndValidity()
    return this.formArray.controls[i].get('balance').value;
  }



  handleChangeQty(i, event, idx) {
    // console.log(event.target.value);
    var total = JSON.parse(this.formArray.controls[i].get('menu').value);
    // console.log(total[idx]);
    total[idx].qty = parseInt(event.target.value);
    // console.log(total);
    this.formArray.controls[i].get('menu').patchValue(JSON.stringify(total))
  }

  handleChangeDisc(i, event, idx) {
    // console.log(event.target.value);
    var total = JSON.parse(this.formArray.controls[i].get('menu').value);
    // console.log(total[idx]);
    total[idx].discount = parseInt(event.target.value);
    // console.log(total);
    this.formArray.controls[i].get('menu').patchValue(JSON.stringify(total))
  }

  getTotal(id, qty, disc, idx, i) {
    // console.log(disc);
    // console.log(id);
    var menu = JSON.parse(this.formArray.controls[i].get('menu').value);

    for (const key in this.allDataMenu) {
      if (Object.prototype.hasOwnProperty.call(this.allDataMenu, key)) {
        const element = this.allDataMenu[key];

        if (id === element.id) {
          var total = element.harga * qty;
          var grand = (disc / 100) * total;
          menu[idx].total = total - grand;
          this.formArray.controls[i].get('menu').patchValue(JSON.stringify(menu))
          return menu[idx].total ? menu[idx].total : 0;
        }

      }
    }
  }

  getGrandTotal(i) {
    var menu = JSON.parse(this.formArray.controls[i].get('menu').value);
    // console.log(menu);
    let total = 0;
    menu.forEach(element => {
      total = element.total + total;
    });
    // console.log(total);

    this.formArray.controls[i].get('grandtotal').setValue(total);
    // console.log(this.formArray.controls[i].get('grandtotal').value);
    return this.formArray.controls[i].get('grandtotal').value;
    // this.formArray.controls[i].get('grandtotal').updateValueAndValidity();
    // return this.formArray.controls[i].get('grandtotal').value ? this.formArray.controls[i].get('grandtotal').value : 0;
  }

  deleteItem(i, idx) {
    // console.log(i, idx);
    let menu: any = JSON.parse(this.formArray.controls[i].get('menu').value);
    menu.forEach((item, index) => {
      if (index === idx) {
        menu.splice(index, 1);
      }
    });
    // console.log(menu);
    this.formArray.controls[i].get('menu').patchValue(JSON.stringify(menu))
  }


  parseMenu(i) {
    var data = JSON.parse(this.formArray.controls[i].get('menu').value);
    let arr = new Array;
    data.forEach(element => {
      let obj: any = new Object;
      obj.id = element.id;
      obj.qty = element.qty;
      obj.discount = element.discount;
      obj.total = 0;
      arr.push(obj)
    });
    return arr;
  }

  callMenu(i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogCustom = this.dialog.open(
      MenuDialogComponent,
      dialogConfig
    );
    dialogCustom.afterClosed().subscribe(res => {
      // console.log(res);
      if (res !== undefined) {
        var data = JSON.parse(this.formArray.controls[i].get('menu').value);
        let arr = new Array;
        data.forEach(element => {
          arr.push(element)
        });
        arr.push(res)
        this.formArray.controls[i].get('menu').patchValue(JSON.stringify(arr))
      }
    });
  }

  updateItem(i) {
    // var id = JSON.parse(this.formArray.controls[i].get('id').value);
    // var menu = JSON.parse(this.formArray.controls[i].get('menu').value);
    // console.log(id, menu);
    let obj: any = new Object;
    obj.id = this.formArray.controls[i].get('id').value;
    obj.menu = this.formArray.controls[i].get('menu').value
    this.cashierService.updateMenu(obj).subscribe(res => {
      if (res['codestatus'] == "00") {
        this.getDataAll()
        this.customDialog("check_circle", res['message'])
      } else {
        this.customDialog("sms_failed", "update payment gagal")
      }
    })
  }

  // getDataExample(event) {
  //   console.log(event);
  // }

  // ==========================================================================
  //                        ON WAITING
  // ==========================================================================

  getDataOnWaiting() {
    this.cashierService.getDataOnWaiting().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnWaiting = res['values']
      }
    })
  }

  getListWaiting(event) {
    return JSON.parse(event)
  }

  // ==========================================================================
  //                        ON READY
  // ==========================================================================
  getDataOnReady() {
    this.cashierService.getDataOnReady().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.listDataOnReady = res['values']

        // for (const key in this.listDataOnOrder) {
        //   if (this.listDataOnReady.hasOwnProperty(key)) {
        //     const element = this.listDataOnReady[key];
        //     this.addItem2(element)
        //   }
        // }
        // if (this.listDataOnReady > 0) this.updateView2()

      }
    })
  }

  // initFormArray2() {
  //   this.form2 = this._formBuilder.group({
  //     formProd2: this._formBuilder.array([])
  //   })
  // }

  // addItem2(element) {
  //   this.formArray2 = this.form.get('formProd2') as FormArray;
  //   this.formArray2.push(this.init(element));
  // }

  // updateView2() {
  //   this.dataSource2.next(this.formArray2.controls);
  // }

  // get formProd2(): FormArray {
  //   return this.form.get('formProd2') as FormArray;
  // }


  // handleChangeQty2(i, event, idx) {
  //   // console.log(event.target.value);
  //   var total = JSON.parse(this.formArray2.controls[i].get('menu').value);
  //   // console.log(total[idx]);
  //   total[idx].qty = parseInt(event.target.value);
  //   // console.log(total);
  //   this.formArray2.controls[i].get('menu').patchValue(JSON.stringify(total))
  // }

  // handleChangeDisc2(i, event, idx) {
  //   // console.log(event.target.value);
  //   var total = JSON.parse(this.formArray2.controls[i].get('menu').value);
  //   // console.log(total[idx]);
  //   total[idx].discount = parseInt(event.target.value);
  //   // console.log(total);
  //   this.formArray2.controls[i].get('menu').patchValue(JSON.stringify(total))
  // }

  // getTotal2(id, qty, disc, idx, i) {
  //   // console.log(disc);
  //   // console.log(id);
  //   var menu = JSON.parse(this.formArray2.controls[i].get('menu').value);

  //   for (const key in this.allDataMenu) {
  //     if (Object.prototype.hasOwnProperty.call(this.allDataMenu, key)) {
  //       const element = this.allDataMenu[key];

  //       if (id === element.id) {
  //         var total = element.harga * qty;
  //         var grand = (disc / 100) * total;
  //         menu[idx].total = total - grand;
  //         this.formArray2.controls[i].get('menu').patchValue(JSON.stringify(menu))
  //         return menu[idx].total ? menu[idx].total : 0;
  //       }

  //     }
  //   }
  // }

  // getGrandTotal2(i) {
  //   var menu = JSON.parse(this.formArray2.controls[i].get('menu').value);
  //   // console.log(menu);
  //   let total = 0;
  //   menu.forEach(element => {
  //     total = element.total + total;
  //   });
  //   // console.log(total);

  //   this.formArray2.controls[i].get('grandtotal').setValue(total);
  //   // console.log(this.formArray.controls[i].get('grandtotal').value);
  //   return this.formArray2.controls[i].get('grandtotal').value;
  //   // this.formArray.controls[i].get('grandtotal').updateValueAndValidity();
  //   // return this.formArray.controls[i].get('grandtotal').value ? this.formArray.controls[i].get('grandtotal').value : 0;
  // }

  // getBalance2(i) {
  //   var total = this.formArray2.controls[i].get('grandtotal').value;
  //   var payment = this.formArray2.controls[i].get('payment').value;
  //   var balance = total - payment;

  //   this.formArray2.controls[i].get('balance').patchValue(balance)
  //   this.formArray2.controls[i].get('balance').updateValueAndValidity()
  //   return this.formArray2.controls[i].get('balance').value;
  // }

  // deleteItem2(i, idx) {
  //   console.log(i, idx);
  //   let menu: any = JSON.parse(this.formArray2.controls[i].get('menu').value);
  //   menu.forEach((item, index) => {
  //     if (index === idx) {
  //       menu.splice(index, 1);
  //     }
  //   });
  //   console.log(menu);
  //   this.formArray2.controls[i].get('menu').patchValue(JSON.stringify(menu))
  // }


  parseMenu2(i) {
    // var data = JSON.parse(this.formArray2.controls[i].get('menu').value);
    var data = JSON.parse(i);
    let arr = new Array;
    // data.forEach(element => {
    //   let obj: any = new Object;
    //   obj.id = element.id;
    //   obj.qty = element.qty;
    //   obj.discount = element.discount;
    //   obj.total = 0;
    //   arr.push(obj)
    // });
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        let obj: any = new Object;
        obj.id = element.id;
        obj.qty = element.qty;
        obj.discount = element.discount;
        obj.total = element.total;
        arr.push(obj)
      }
    }
    return arr;
  }

  // callMenu2(i) {
  //   const dialogConfig2 = new MatDialogConfig();
  //   dialogConfig2.backdropClass = "backdropBackground";
  //   dialogConfig2.disableClose = true;
  //   dialogConfig2.minWidth = "min-content";

  //   const dialogCustom2 = this.dialog.open(
  //     MenuDialogComponent,
  //     dialogConfig2
  //   );
  //   dialogCustom2.afterClosed().subscribe(res => {
  //     console.log(res);
  //     if (res !== undefined) {
  //       var data = JSON.parse(this.formArray2.controls[i].get('menu').value);
  //       let arr = new Array;
  //       data.forEach(element => {
  //         arr.push(element)
  //       });
  //       arr.push(res)
  //       this.formArray2.controls[i].get('menu').patchValue(JSON.stringify(arr))
  //     }
  //   });
  // }

  done(id) {
    // console.log(id);
    let obj: any = new Object;
    obj.id = id;
    this.cashierService.doneOrder(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] === "00") {
        this.getDataAll()
      }
    })
  }

  // ==========================================================================
  //                        PAYMENT
  // ==========================================================================

  // PAYMENT ORDER
  paymentOrder(i) {
    // console.log(i);
    if (this.formArray.controls[i].get('order_id').valid) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.formArray.controls[i].value;
      dialogConfig.backdropClass = "backdropBackground";
      dialogConfig.disableClose = true;
      dialogConfig.minWidth = "min-content";

      const dialogCustom = this.dialog.open(
        PaymentDialogComponent,
        dialogConfig
      );
      dialogCustom.afterClosed().subscribe(res => {
        // console.log(res);
        if (res !== undefined) {
          if (res['codestatus'] == "00") {
            this.getDataAll()
            this.customDialog("check_circle", res['message'])
          } else {
            this.customDialog("sms_failed", "update payment gagal")
          }
        }
      })
    } else {
      this.customDialog("sms_failed", "order Id tidak boleh kosong")
    }
  }

  paymentReady(i) {
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
      // console.log(res);
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



  // ==========================================================================
  //                        ROUTING
  // ==========================================================================

  makeAvailable() {
    this.route.navigate(['/available'])
  }

  selfOrder() {
    this.route.navigate(['/orderself'])
  }


  historyOrder() {
    this.route.navigate(['/history'])
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['/login'])
  }

  checkValue(i) {
    // console.log(i);
    // console.log(this.formArray.controls[i].get('status_payment').value);
    return this.formArray.controls[i].get('status_payment').value;
  }

}
