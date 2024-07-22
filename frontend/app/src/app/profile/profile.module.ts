import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProfileComponent } from './profile.component';
import { EditComponent } from './edit/edit.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from './password/password.component';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@NgModule({
  declarations: [
    ProfileComponent,
    EditComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ButtonModule,
    ReactiveFormsModule,
    MessagesModule,
    InputTextModule,
    DynamicDialogModule,
    PasswordModule,
    ConfirmDialogModule,
    InputGroupModule,
    InputGroupAddonModule,
  ]
})
export class ProfileModule { }
