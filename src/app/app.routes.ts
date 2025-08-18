import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard'; 
import { UserManagementComponent } from './components/userMang/userMang.component'; 
import { OrdersComponent } from './components/orders/orders.component';
import { SitesComponent } from './components/sites/sites.component';
import { AuthGuard } from './guards/auth.guard';
import { ManagerGuard } from './guards/manager.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { 
        path: 'dashboard', 
        component: UserDashboardComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'user-management', 
        component: UserManagementComponent, 
        canActivate: [AuthGuard, ManagerGuard] 
    },
    { 
        path: 'orders', 
        component: OrdersComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'sites', 
        component: SitesComponent, 
        canActivate: [AuthGuard] 
    },
    { path: '**', redirectTo: '/dashboard' } 
];