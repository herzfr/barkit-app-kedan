import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddUserComponent } from '../dialog/add-user/add-user.component';
import { CustomDialogComponent } from '../dialog/custom-dialog/custom-dialog.component';
import { PasswordUserComponent } from '../dialog/password-user/password-user.component';
import { UpdateUserComponent } from '../dialog/update-user/update-user.component';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns = ['name', 'email', 'username', 'pulang', 'masuk', 'update', 'upassword', 'delete'];
  dataSource: MatTableDataSource<User>;

  constructor(private userServices: UserService, private route: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllDataUser()
  }

  getUserInfo() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    return user.name;
  }


  getAllDataUser() {
    this.userServices.getAllUser().subscribe(res => {
      if (res['codestatus'] == "00") {
        // console.log(res['values']);
        this.dataSource = new MatTableDataSource(
          res['values']
        );
      }
    })
  }

  addUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogCustom = this.dialog.open(
      AddUserComponent,
      dialogConfig
    );
    dialogCustom.afterClosed().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        this.userServices.signup(res).subscribe(resp => {
          if (resp['codestatus'] == "00") {
            // console.log(resp);
            this.getAllDataUser()
            this.customDialog("check_circle", resp['message'])
          } else {
            this.customDialog("sms_failed", resp['message'])
          }
        })
      }
    });
  }

  updateData(event) {
    // console.log(event);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = event;
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogCustom = this.dialog.open(
      UpdateUserComponent,
      dialogConfig
    );
    dialogCustom.afterClosed().subscribe(res => {
      console.log(res);
      if (res !== undefined) {
        this.userServices.update(res).subscribe(resp => {
          if (resp['codestatus'] == "00") {
            // console.log(resp);
            this.getAllDataUser()
            this.customDialog("check_circle", resp['message'])
          } else {
            this.customDialog("sms_failed", resp['message'])
          }
        })
      }
    });
  }

  updatePass(event) {
    // console.log(event);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = event.username;
    dialogConfig.backdropClass = "backdropBackground";
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = "min-content";

    const dialogCustom = this.dialog.open(
      PasswordUserComponent,
      dialogConfig
    );
    dialogCustom.afterClosed().subscribe(res => {
      // console.log(res);
      if (res !== undefined) {
        this.userServices.updatePass(res).subscribe(resp => {
          if (resp['codestatus'] == "00") {
            // console.log(resp);
            this.getAllDataUser()
            this.customDialog("check_circle", resp['message'])
          } else {
            this.customDialog("sms_failed", resp['message'])
          }
        })
      }
    });
  }

  deleteBy(event) {
    let obj: any = new Object;
    obj.id = event.id;
    this.userServices.delete(obj).subscribe(resp => {
      if (resp['codestatus'] == "00") {
        // console.log(resp);
        this.getAllDataUser()
        this.customDialog("check_circle", resp['message'])
      } else {
        this.customDialog("sms_failed", resp['message'])
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
    this.route.navigate(['/management-absen'])
  }
}
