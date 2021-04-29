import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
declare var $: any;

@Component({
  selector: 'app-scan-order',
  templateUrl: './scan-order.component.html',
  styleUrls: ['./scan-order.component.css']
})
export class ScanOrderComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchElement: ElementRef;
  values
  options: AnimationOptions = {
    path: 'assets/json/scan_animation.json',
  };
  constructor(private dialogRef: MatDialogRef<ScanOrderComponent>, @Inject(MAT_DIALOG_DATA) data) {

  }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.searchElement.nativeElement.focus();
  }

  onNoClick() {
    this.dialogRef.close()
  }


  func(event) {
    // console.log(event.target.value);
    var last = event.target.value
    if (last.endsWith("@")) {
      let data = this.values
      data = data.substring(0, data.length - 1);
      this.dialogRef.close(data)
    }
  };

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

}
