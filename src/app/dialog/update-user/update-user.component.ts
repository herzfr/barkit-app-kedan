import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  form: FormGroup
  constructor(private dialogRef: MatDialogRef<UpdateUserComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.buildForm(data)
  }

  ngOnInit(): void {

  }

  buildForm(event) {
    this.form = this.init(event);
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

  onSave() {
    if (this.form.valid) {
      // console.log(this.form.value);   
      this.dialogRef.close(this.form.value)
    } else {
      alert('Data ada yang tidak terisi')
    }
  }


  onNoClick() {
    this.dialogRef.close()
  }

}
