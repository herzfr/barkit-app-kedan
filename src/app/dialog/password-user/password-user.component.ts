import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-password-user',
  templateUrl: './password-user.component.html',
  styleUrls: ['./password-user.component.css']
})
export class PasswordUserComponent implements OnInit {

  form: FormGroup
  constructor(private dialogRef: MatDialogRef<PasswordUserComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.buildForm();
    this.form.get('username').patchValue(data);
  }

  ngOnInit(): void {

  }

  buildForm() {
    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    })
  }


  onSave() {
    if (this.form.valid) {
      // console.log(this.form.value);
      this.dialogRef.close(this.form.value)
    } else {
      alert('Data password tidak terisi')
    }
  }


  onNoClick() {
    this.dialogRef.close()
  }






}
