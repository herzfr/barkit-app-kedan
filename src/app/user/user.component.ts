import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  displayedColumns = ['name', 'email', 'username', 'pulang', 'masuk', 'update', 'delete'];
  dataSource: MatTableDataSource<User>;

  constructor(private userServices: UserService, private route: Router) { }

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
        console.log(res['values']);
        this.dataSource = new MatTableDataSource(
          res['values']
        );
      }
    })
  }

  addUser() {

  }


  back() {
    this.route.navigate(['/management-absen'])
  }
}
