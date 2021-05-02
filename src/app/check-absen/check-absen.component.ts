import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-check-absen',
  templateUrl: './check-absen.component.html',
  styleUrls: ['./check-absen.component.css']
})
export class CheckAbsenComponent implements OnInit {

  dataqr = "empty object";
  constructor(private loc: LocationService, private route: Router) { }

  ngOnInit(): void {
  }

  generateQr() {
    this.loc.getPosition().then(pos => {
      // console.log(`Positon: ${pos.lng} ${pos.lat}`);
      // console.log(pos.lng, pos.lat);
      let obj: any = new Object;
      obj.lat = pos.lng;
      obj.lon = pos.lat;
      this.dataqr = JSON.stringify(obj);
    });
  }

  logout() {
    localStorage.clear()
    this.route.navigate(['/login'])
  }


}
