import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../shared/services/user.service';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TableModule,
    ProgressBarModule
  ],
  providers: [UserService]
})
export class UsersModule { }
