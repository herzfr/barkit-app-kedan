import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-choose-dialog',
  templateUrl: './choose-dialog.component.html',
  styleUrls: ['./choose-dialog.component.css']
})
export class ChooseDialogComponent implements OnInit {

  menu;
  quantity: number = 0;
  i = 0;

  constructor(private dialogRef: MatDialogRef<ChooseDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog) {
    this.menu = data;
    // console.log(data);

  }


  ngOnInit() {
  }

  getDataImage(event) {
    if (event == "" || event == null) {
      return 'assets/images/sample_makanan.png'
    } else {
      return event;
    }
  }

  plus() {
    if (this.i < 20) {
      this.i++;
      this.quantity = this.i;
    }
  }

  minus() {
    if (this.i != 0) {
      this.i--;
      this.quantity = this.i;
    }
  }

  onOrder(event) {

    if (this.quantity == 0) {
      const dialogConfig = new MatDialogConfig();

      let obj: any = new Object();
      obj.icon = "priority_high";
      obj.message = "Silahkan memilih jumlah pesanan terlebih dahulu";

      dialogConfig.data = obj;
      dialogConfig.backdropClass = "backdropBackground";
      dialogConfig.disableClose = true;
      dialogConfig.minWidth = "min-content";

      const dialogChooseMenu = this.dialog.open(
        CustomDialogComponent,
        dialogConfig
      );
      dialogChooseMenu.afterClosed();
    } else {
      let obj: any = new Object();
      obj.id = event.id;
      obj.name = event.name;
      obj.harga = event.harga;
      obj.desc = event.desc;
      obj.qty = this.quantity;
      obj.avatar = event.avatar;
      // console.log(obj);
      this.dialogRef.close(obj);
    }

  }

  onNoClick() {
    this.dialogRef.close()
  }

}
