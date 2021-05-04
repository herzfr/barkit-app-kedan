import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AddDialogComponent } from '../dialog/add-dialog/add-dialog.component';
import { AvatarDialogComponent } from '../dialog/avatar-dialog/avatar-dialog.component';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { Product } from '../models/product';
import { AvailableService } from '../services/available.service';
declare var $: any;


@Component({
  selector: 'app-available',
  templateUrl: './available.component.html',
  styleUrls: ['./available.component.css']
})
export class AvailableComponent implements OnInit {
  displayedColumns: string[] = [
    "no",
    "avatar",
    "name",
    "desc",
    "category",
    "harga",
    "available",
    "update",
    "delete",
    // "edit",
    // "change",
  ];

  categoryl;
  searchValue;

  form: FormGroup;
  formArray: FormArray;
  products: Product[] = [];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  allDataMenu: any;

  loading = false;
  loadingTemplate: TemplateRef<any>;

  isDisableDelete = true;

  constructor(private availableService: AvailableService, private _formBuilder: FormBuilder, private dialog: MatDialog,
    private route: Router, private renderer: Renderer2) {
    this.availableService.getAllCategory().subscribe(res => {
      if (res['codestatus'] === "00") {
        this.categoryl = res['values']
        // console.log(this.categoryl);
      }
    })
  }


  ngOnInit(): void {
    this.getUserInfo()
    this.getUserRole()
    this.initFormArray()
    this.getAllMenu("")
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

  // get formProd(): FormArray {
  //   return this.form.get('formProd') as FormArray;
  // }


  //  ================================================================================================
  //  Push Formgroup to FormArray
  //  ================================================================================================
  addItem(element) {
    this.formArray = this.form.get('formProd') as FormArray;
    this.formArray.push(this.init(element));
  }


  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }

  getUserRole() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    // console.log(user.roles);
    for (const key in user.roles) {
      if (Object.prototype.hasOwnProperty.call(user.roles, key)) {
        const element = user.roles[key];
        if (element === "ROLE_ADMIN") {
          this.isDisableDelete = false;
        } else {
          this.isDisableDelete = true;
        }

      }
    }
    // return user.role;
  }

  getAllMenu(search) {
    this.loading = true;
    let obj: any = new Object;
    obj.search = search;
    this.availableService.getAllMenuLike(obj).subscribe(res => {
      // console.log(res);
      if (res['codestatus'] == "00") {
        this.allDataMenu = res['values']
        // console.log(this.form);
        for (const key in this.allDataMenu) {
          if (this.allDataMenu.hasOwnProperty(key)) {
            const element = this.allDataMenu[key];
            this.addItem(element)
          }
        }
        this.updateView()
        this.loading = false
      }
    })
  }

  getPipeNameCategory(id) {
    for (const key in this.categoryl) {
      if (Object.prototype.hasOwnProperty.call(this.categoryl, key)) {
        const element = this.categoryl[key];
        // console.log(element);
        if (element.id === id) {
          return element.name;
        }
      }
    }
  }



  getDataImage(event) {
    if (event == "" || event == null) {
      return 'assets/images/sample_makanan.png'
    } else {
      return event;
    }
  }

  applyFilter() {
    this.initFormArray()
    this.getAllMenu(this.searchValue)
  }


  updateView() {
    this.dataSource.next(this.formArray.controls);
  }

  updateData() {
    // console.log(this.form.get('formProd').value);
    this.loading = true;
    this.availableService.updateProduct(this.form.get('formProd').value).subscribe(res => {
      if (res['codestatus'] == "00") {
        this.initFormArray()
        this.getAllMenu("")
        this.loading = false;
        this.customDialog("check_circle", res['message'])
      } else {
        this.customDialog("sms_failed", "Data Failed")
      }
    })
  }

  updateAvatar(event) {
    // console.log(event);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = event;
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = "300px";

    const dialogScanQR = this.dialog.open(
      AvatarDialogComponent,
      dialogConfig
    );

    dialogScanQR.afterClosed().subscribe(res => {
      console.log(res);
      this.changeAvatar(res);
    })

  }

  changeAvatar(obj) {
    this.loading = true;
    this.availableService.updateAvatar(obj).subscribe(res => {
      if (res['codestatus'] == "00") {
        this.initFormArray()
        this.getAllMenu("")
        this.loading = false;
        this.customDialog("check_circle", res['message'])
      } else {
        this.customDialog("sms_failed", "Data Failed")
      }
    })
  }

  addData() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogCustom = this.dialog.open(
      AddDialogComponent,
      dialogConfig
    );
    dialogCustom.afterClosed().subscribe(res => {
      // console.log(res);
      if (res !== undefined) {
        this.loading = true;
        this.availableService.addProduct(res).subscribe(resp => {
          if (resp['codestatus'] == "00") {
            // console.log(resp);
            this.initFormArray()
            this.getAllMenu("")
            this.loading = false;
            this.customDialog("check_circle", resp['message'])
          } else {
            this.customDialog("sms_failed", "Data Failed")
          }
        })
      }
    });
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

  private i = 0;
  private id;
  deleteMenu(event) {
    // this.id = event.id;
    if (this.id === event.id) {
      this.i++
      if (this.i == 2) {
        let obj: any = new Object();
        obj.id = event.id;
        this.loading = true;
        this.availableService.deleteProduct(obj).subscribe(res => {
          if (res['codestatus'] == "00") {
            this.initFormArray()
            this.getAllMenu("")
            this.loading = false;
            // console.log(res);
            this.customDialog("check_circle", res['message'])
          } else {
            this.customDialog("sms_failed", "Data Failed")
          }
        })
      }
    } else {
      this.id = event.id
      this.i = 0;
    }
  }



  back() {
    this.route.navigate(['/home'])
  }


  // check(event) {
  //   console.log(event);
  // }

}


