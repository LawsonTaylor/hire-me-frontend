import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { SplashComponent } from './splash/splash.component';
import { LoginComponent } from './login';
import { RegisterUserComponent } from './registerUser';
import { RegisterCompanyComponent } from './registerCompany';
import { AuthGuard } from './guards';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'register', component: SplashComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'register-company', component: RegisterCompanyComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
