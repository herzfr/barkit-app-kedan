import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;


@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.css']
})
export class AvatarDialogComponent implements OnInit {

  id;
  avatar;
  name;

  fileList: FileList;

  constructor(private dialogRef: MatDialogRef<AvatarDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private domSanitizer: DomSanitizer) {
    this.id = data.id
    this.avatar = data.avatar
    this.name = data.name
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
    if (this.fileList != undefined) {
      if (this.fileList.length > 0) {
        const file: File = this.fileList[0];
        let obj: any = new Object();
        obj.id = this.id
        obj.avatar = file;
        this.dialogRef.close(obj)
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onloadend = () => {
        //   // console.log(reader);
        //   // console.log(file);
        //   let base64: string = reader.result.toString();
        //   let base64String = base64.replace(/^data:image\/[a-z]+;base64,/, "");
        // };
      } else {
        this.dialogRef.close()
      }
    } else {
      alert('please choose your image file first')
    }

  }

  cancelUploaded() {
    this.dialogRef.close()
  }

}
