import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { 
    path: "register", 
    component: RegisterComponent,
  },
  { 
    path: "profile", 
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  { 
    path: "users", 
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
  },
  { 
    path: '', redirectTo: 'users', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
