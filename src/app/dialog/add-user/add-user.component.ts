import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  roles = [
    { name: "Admin", id: ["admin"] },
    { name: "Cashier", id: ["cashier"] },
    { name: "Kitchen", id: ["kitchen"] },
    { name: "User", id: ["user"] },
  ]

  form: FormGroup
  user: User = new User();


  constructor(private dialogRef: MatDialogRef<AddUserComponent>, @Inject(MAT_DIALOG_DATA) data, private formBuilder: FormBuilder) {
    this.buildForm()
  }

  ngOnInit(): void {
  }


  buildForm() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.email),
      username: new FormControl("", Validators.required),
      passwords: this.formBuilder.group({
        password: ['', [Validators.required]],
        confirmedPassword: ['', [Validators.required]],
      }, { validator: this.passwordConfirming }),
      role: new FormControl(["admin"], Validators.required),
      masuk: new FormControl("00:00:00", Validators.required),
      pulang: new FormControl("00:00:00", Validators.required)
    })
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmedPassword').value) {
      return { invalid: true };
    }
  }


  requiredPassword() {
    let form = this.form.controls.passwords;
    if (form.get('password').touched && form.get('confirmedPassword').touched) {
      return form.get('password').hasError('required') && form.get('confirmedPassword').hasError('required')
    } else {
      return false;
    }
  }

  passwordMatch() {
    // console.log(this.registerForm.controls.passwords);
    let form = this.form.controls.passwords;
    if (form.get('password').value == form.get('confirmedPassword').value) {
      return false;
    } else {
      return true;
    }
  }



  onSave() {
    if (this.form.valid) {

      let passwords = this.form.controls.passwords
      this.user.password = passwords.get('confirmedPassword').value
      this.user.name = this.form.controls['name'].value
      this.user.email = this.form.controls['email'].value
      this.user.username = this.form.controls['username'].value
      this.user.roles = this.form.controls['role'].value
      this.user.masuk = this.form.controls['masuk'].value
      this.user.pulang = this.form.controls['pulang'].value
      // console.log(this.user);
      this.dialogRef.close(this.user)
    } else {
      alert('Data ada yang tidak terisi atau tidak cocok')
    }
  }


  onNoClick() {
    this.dialogRef.close()
  }

}
