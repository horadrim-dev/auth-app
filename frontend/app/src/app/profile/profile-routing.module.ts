import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ProfileComponent } from './profile.component';
import { EditComponent } from './edit/edit.component';
import { ChangePasswordComponent } from './password/password.component';

const routes: Routes = [
  { 
    path: 'edit', 
    component: EditComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '', 
    component: ProfileComponent ,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
