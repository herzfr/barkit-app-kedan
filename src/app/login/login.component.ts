import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../models/login';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  login: Login;

  constructor(private authService: AuthService, private route: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
  }

  submit() {
    this.login = this.loginForm.value
    this.authService.signin(this.login).subscribe(res => {
      // console.log(res['status']);
      if (res['status'] === 400 || res['status'] === 401 || res['status'] === 404) {
        alert(res['error'].message)
      } else {
        console.log(res);
        this.resetcredentials();
        localStorage.setItem("currentUser", JSON.stringify(res));
        this.route.navigate(["/home"]);
      }
    })
  }


  resetcredentials() {
    localStorage.removeItem("currentUser");
  }

}
