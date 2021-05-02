import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cashier: boolean;
  kitchen: boolean;
  admin: boolean;
  user: boolean;


  constructor() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const roles = user['roles'];
    for (const key in roles) {
      if (Object.prototype.hasOwnProperty.call(roles, key)) {
        const element = roles[key];
        switch (element) {
          case 'ROLE_CASHIER':
            this.cashier = true;
            this.kitchen = false;
            this.admin = false;
            this.user = false;
            break;
          case 'ROLE_KITCHEN':
            this.cashier = false;
            this.kitchen = true;
            this.admin = false;
            this.user = false;
            break;
          case 'ROLE_ADMIN':
            this.cashier = false;
            this.kitchen = false;
            this.admin = true;
            this.user = false;
            break;
          case 'ROLE_USER':
            this.cashier = false;
            this.kitchen = false;
            this.admin = false;
            this.user = true;
            break;
        }
      }
    }
  }

  ngOnInit(): void {
  }



}
