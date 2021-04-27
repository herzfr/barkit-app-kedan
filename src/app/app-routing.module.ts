import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashierComponent } from './cashier/cashier.component';
import { HomeComponent } from './home/home.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthGuard } from './services/auth.guard';


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
      allowedRoles: ["ROLE_CASHIER", "ROLE_KITCHEN"]
    },
  },
  {
    path: "cashier",
    component: CashierComponent
  },
  {
    path: "kitchen",
    component: KitchenComponent
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
