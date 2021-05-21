import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AvailableService } from 'src/app/services/available.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialogComponent implements OnInit {
  searchValue;
  menuAll;
  constructor(private dialogRef: MatDialogRef<MenuDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private availableService: AvailableService) {
  }

  ngOnInit(): void {
    this.getAllMenu("")
  }


  getAllMenu(search) {
    let obj: any = new Object;
    obj.search = search;
    this.availableService.getAllMenuLike(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] == "00") {
        this.menuAll = res['values']
        // console.log(this.form);
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
    console.log(event);
    let obj: any = new Object;
    obj.id = event.id;
    obj.qty = 1;
    obj.discount = 0;
    obj.total = 0;
    this.dialogRef.close(obj)
  }

  onNoClick() {
    this.dialogRef.close()
  }

}
