import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-whatsapp-integrated',
  templateUrl: './whatsapp-integrated.component.html',
  styleUrls: ['./whatsapp-integrated.component.css']
})
export class WhatsappIntegratedComponent implements OnInit {

  dataqr;
  constructor(private dialogRef: MatDialogRef<WhatsappIntegratedComponent>, @Inject(MAT_DIALOG_DATA) data) {

  }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close()
  }
}
