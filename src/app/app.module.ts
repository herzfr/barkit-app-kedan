import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketioService } from './services/socketio.service';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { KitchenComponent } from './kitchen/kitchen.component';
import { CashierComponent } from './cashier/cashier.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { CashierService } from './services/cashier.service';
import { KitchenService } from './services/kitchen.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScanOrderComponent } from './dialog/scan-order/scan-order.component';
import { CustomDialogComponent } from './dialog/custom-dialog/custom-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KitchenComponent,
    CashierComponent,
    LoginComponent,
    NotfoundComponent,
    ScanOrderComponent,
    CustomDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,


    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  entryComponents: [ScanOrderComponent],
  providers: [SocketioService, AuthService, CashierService, KitchenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
