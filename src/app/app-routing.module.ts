import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbsenComponent } from './absen/absen.component';
import { AddsComponent } from './adds/adds.component';
import { AdminComponent } from './admin/admin.component';
import { AvailableComponent } from './available/available.component';
import { CashierComponent } from './cashier/cashier.component';
import { CheckAbsenComponent } from './check-absen/check-absen.component';
import { HomeComponent } from './home/home.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { AuthGuard } from './services/auth.guard';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_CASHIER", "ROLE_KITCHEN", "ROLE_ADMIN", "ROLE_USER"]
    },
  },
  {
    path: "cashier",
    component: CashierComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_CASHIER"]
    },
  },
  {
    path: "orderself",
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_CASHIER"]
    },
  },
  {
    path: "kitchen",
    component: KitchenComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_KITCHEN"]
    },
  },
  {
    path: "available",
    component: AvailableComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_CASHIER", "ROLE_ADMIN"]
    },
  },
  {
    path: "management",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_ADMIN"]
    },
  },
  {
    path: "management-absen",
    component: AbsenComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_ADMIN"]
    },
  },
  {
    path: "management-user",
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_ADMIN"]
    },
  },
  {
    path: "management-adds",
    component: AddsComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_ADMIN"]
    },
  },
  {
    path: "check-absen",
    component: CheckAbsenComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ["ROLE_USER"]
    },
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
