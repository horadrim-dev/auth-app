import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from './password/password.component';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../shared/services/user.service';
import { ToastService } from '../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DialogService, ConfirmationService]
})
export class ProfileComponent {

  currentUser: User|null = null;
  ref: DynamicDialogRef | undefined;

  constructor(
    private _authService : AuthService,
    public dialogService: DialogService,
    public confirmationService: ConfirmationService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router,
  ){
    this._authService.currentUser.subscribe(x => {
       this.currentUser = x; 
    });
  }

  // change password button pressed
  changePasswordDialog(){
    this.ref = this.dialogService.open(ChangePasswordComponent, { header: 'Изменить пароль', width: '50vw',});
  }

  // delete user button pressed
  deleteUserConfirmDialog(event: Event){

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Вы собираетесь удалить аккаунт.<br> Учетная запись и все связанные данные будут безвозвратно удалены ',
      header: 'Вы уверены?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
          // user confirmed deletion

          if (!this.currentUser) return;

          // trying to delete user
          this.userService.deleteUser(this.currentUser.user_id.toString())
            .subscribe({
            next:(data) => {
              // success, user deleted, 
              // logout and redirection to home

              this._authService.logout();
              this.router.navigate(['/']);
            },
            error:(err) => {
              console.log(err.error)
              this.toastService.toast('error', 'Ошибка', 'Не удалось удалить аккаунт. Сервер недоступен.')
            }
            });
      },
      reject: () => {}
    });

  }
}
