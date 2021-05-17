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
import { CashierService } from './services/cashier.service';
import { KitchenService } from './services/kitchen.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScanOrderComponent } from './dialog/scan-order/scan-order.component';
import { CustomDialogComponent } from './dialog/custom-dialog/custom-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AvailableComponent } from './available/available.component';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { AvailableService } from './services/available.service';
import { MatTableModule } from '@angular/material/table';
import { CategoryPipe } from './pipes/category.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { AvatarDialogComponent } from './dialog/avatar-dialog/avatar-dialog.component';
import { AddDialogComponent } from './dialog/add-dialog/add-dialog.component';
import { AdminComponent } from './admin/admin.component';
import { ManagementService } from './services/management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AbsenComponent } from './absen/absen.component';
import { AbsenDialogComponent } from './dialog/absen-dialog/absen-dialog.component';
import { DatePipe } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserService } from './services/user.service';
import { UpdateUserComponent } from './dialog/update-user/update-user.component';
import { AddUserComponent } from './dialog/add-user/add-user.component';
import { PasswordUserComponent } from './dialog/password-user/password-user.component';
import { CheckAbsenComponent } from './check-absen/check-absen.component';
import { QRCodeModule } from 'angularx-qrcode';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AddsComponent } from './adds/adds.component';
import { AddsService } from './services/adds.service';
import { AddsDialogComponent } from './dialog/adds-dialog/adds-dialog.component';
import { WhatsappIntegratedComponent } from './dialog/whatsapp-integrated/whatsapp-integrated.component';
import { WhatsappService } from './services/whatsapp.service';
import { OrderComponent } from './order/order.component';
import { ChooseDialogComponent } from './dialog/choose-dialog/choose-dialog.component';


export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KitchenComponent,
    CashierComponent,
    LoginComponent,
    ScanOrderComponent,
    CustomDialogComponent,
    AvailableComponent,
    CategoryPipe,
    AvatarDialogComponent,
    AddDialogComponent,
    AdminComponent,
    AbsenComponent,
    AbsenDialogComponent,
    UserComponent,
    UpdateUserComponent,
    AddUserComponent,
    PasswordUserComponent,
    CheckAbsenComponent,
    AddsComponent,
    AddsDialogComponent,
    WhatsappIntegratedComponent,
    OrderComponent,
    ChooseDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    LottieModule.forRoot({ player: playerFactory }),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.chasingDots,
      backdropBackgroundColour: 'rgba(0,0,0,0.50)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    QRCodeModule,
    LeafletModule,

    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  entryComponents: [ScanOrderComponent, AvatarDialogComponent],
  providers: [SocketioService, AuthService, CashierService, KitchenService, AvailableService,
    ManagementService, DatePipe, UserService, AddsService, WhatsappService],
  bootstrap: [AppComponent]
})
export class AppModule { }
