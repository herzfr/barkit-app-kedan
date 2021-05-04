import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AddsDialogComponent } from '../dialog/adds-dialog/adds-dialog.component';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { Adds } from '../models/adds';
import { AddsService } from '../services/adds.service';

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.css']
})
export class AddsComponent implements OnInit {


  displayedColumns = ['no', 'title', 'avatar', 'status', 'delete'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  form: FormGroup;
  formArray: FormArray;
  products: Adds[] = [];

  allDataMenu: any;
  loading = false;

  loadingTemplate: TemplateRef<any>;

  constructor(private _formBuilder: FormBuilder, private dialog: MatDialog,
    private route: Router, private addServ: AddsService) { }

  ngOnInit(): void {
    this.getUserInfo()
    this.initFormArray()
    this.getAllAdds()
  }

  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  initFormArray() {
    this.form = this._formBuilder.group({
      formProd: this._formBuilder.array([])
    })
  }

  init(event) {
    // // console.log(event);
    let orderFormGroup: FormGroup = new FormGroup({})
    for (const key in event) {
      if (event.hasOwnProperty(key)) {
        const el = event[key];
        // // console.log(key, el);
        orderFormGroup.addControl(key, new FormControl(el, Validators.required))
      }
    }
    // // console.log(orderFormGroup);
    return orderFormGroup;
  }

  addItem(element) {
    this.formArray = this.form.get('formProd') as FormArray;
    this.formArray.push(this.init(element));
  }

  getAllAdds() {
    this.loading = true;
    this.addServ.getAllAdds().subscribe(res => {
      // console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
        // // console.log(this.form);
        for (const key in this.allDataMenu) {
          if (this.allDataMenu.hasOwnProperty(key)) {
            const element = this.allDataMenu[key];
            this.addItem(element)
          }
        }
        // // console.log(this.allDataMenu.length > 0);
        if (this.allDataMenu.length > 0) this.updateView();
        this.loading = false;
        // this.updateView()
        // this.loading = false
      }
    })
  }

  getDataImage(event) {
    if (event == "" || event == null) {
      return 'assets/images/sample_makanan.png'
    } else {
      return event;
    }
  }

  updateView() {
    this.dataSource.next(this.formArray.controls);
  }


  addAdsens() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "300px";

    const dialogAdd = this.dialog.open(
      AddsDialogComponent,
      dialogConfig
    );

    dialogAdd.afterClosed().subscribe(res => {
      // console.log(res);
      if (res != undefined) {
        this.loading = true;
        this.addServ.addAds(res).subscribe(res => {
          if (res['codestatus'] == "00") {
            this.initFormArray()
            this.getAllAdds()
            this.loading = false;
            this.customDialog("check_circle", res['message'])
          } else {
            this.customDialog("sms_failed", "Data Failed")
          }
        })
      }
      // this.changeAvatar(res);
    })
  }

  tayangAds() {
    // // console.log(this.form.get('formProd').value);
    this.loading = true;
    this.addServ.updateShow(this.form.get('formProd').value).subscribe(res => {
      if (res['codestatus'] == "00") {
        this.initFormArray()
        this.getAllAdds()
        this.loading = false;
        this.customDialog("check_circle", res['message'])
      } else {
        this.customDialog("sms_failed", "Data Failed")
      }
    })
  }

  deleteMenu(event) {
    this.loading = true;
    let obj: any = new Object();
    obj.id = event.id;
    this.addServ.deleteAds(obj).subscribe(res => {
      if (res['codestatus'] == "00") {
        // // console.log(res);
        this.initFormArray()
        this.getAllAdds()
        this.loading = false;
        this.customDialog("check_circle", res['message'])
      } else {
        this.customDialog("sms_failed", "Data Failed")
      }
    })
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

  back() {
    this.route.navigate(['/home'])
  }
}
