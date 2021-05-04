import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var $: any;

@Component({
  selector: 'app-adds-dialog',
  templateUrl: './adds-dialog.component.html',
  styleUrls: ['./adds-dialog.component.css']
})
export class AddsDialogComponent implements OnInit {

  title;
  avatar;
  name;

  fileList: FileList;

  constructor(private dialogRef: MatDialogRef<AddsDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit(): void {
    $(document).ready(function () {
      // get the name of uploaded file
      $('input[type="file"]').change(function () {
        this.avatar = $("input[type='file']").val();
        $('.js-value').text(this.avatar);
      });

    });
  }

  onFileSelect(event) {
    // console.log(event);
    this.fileList = event.target.files;
    // console.log(this.fileList);
  }


  uploadAvatar() {
    if (this.fileList != undefined && this.title != undefined) {
      if (this.fileList.length > 0) {
        const file: File = this.fileList[0];
        let obj: any = new Object();
        obj.title = this.title
        obj.avatar = file;
        this.dialogRef.close(obj)
      } else {
        this.dialogRef.close()
      }
    } else {
      alert('please choose your image and input title')
    }

  }

  cancelUploaded() {
    this.dialogRef.close()
  }


}
