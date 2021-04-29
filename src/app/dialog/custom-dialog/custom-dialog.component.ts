import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit {

  icon;
  message;

  constructor(private dialogRef: MatDialogRef<CustomDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    // console.log(data);
    this.icon = data.icon;
    this.message = data.message;
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close()
  }
}
