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
    NotfoundComponent,
    ScanOrderComponent,
    CustomDialogComponent,
    AvailableComponent,
    CategoryPipe,
    AvatarDialogComponent,
    AddDialogComponent,
    AdminComponent
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


    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  entryComponents: [ScanOrderComponent, AvatarDialogComponent],
  providers: [SocketioService, AuthService, CashierService, KitchenService, AvailableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
