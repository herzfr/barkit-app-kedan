import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AvailableService } from 'src/app/services/available.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  form: FormGroup
  categoryl;
  constructor(private dialogRef: MatDialogRef<AddDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private availableService: AvailableService) {

    this.availableService.getAllCategory().subscribe(res => {
      if (res['codestatus'] === "00") {
        this.categoryl = res['values']
        // console.log(this.categoryl);
      }
    })

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      desc: new FormControl("", Validators.required),
      category: new FormControl(1, Validators.required),
      harga: new FormControl(0, Validators.required),
      available: new FormControl(true, Validators.required)
    })
  }

  ngOnInit(): void {
  }


  onSave() {
    // console.log(this.form.get('name').valid);
    if (this.form.get('name').valid) {
      this.dialogRef.close(this.form.value)
    } else {
      alert('Input nor required')
    }

  }

  onNoClick() {
    this.dialogRef.close()
  }

}
