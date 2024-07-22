import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [MessageService, DialogService]
})
export class ChangePasswordComponent  {

    changePasswordForm: FormGroup;
    loading = false;
    submitted = false;
    currentUser: User|null = null;

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private toastService: ToastService,
        private userService: UserService,
        private authService: AuthService,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) { 
        this.authService.currentUser.subscribe(x => this.currentUser = x);

        this.changePasswordForm = new FormGroup({
            old_password: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            confirmPassword: new FormControl('', [Validators.required]),
        }, {
            validators: this.requireConfirmPasswordValidator
        });
    }

    // validator password field equal to confirmPassword
    requireConfirmPasswordValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password !== confirmPassword ? {requireConfirmPassword: true} : null;
    };

    // convenience getter for easy access to form fields
    get f() { return this.changePasswordForm; }

    onSubmit() {
        this.submitted = true;
        this.messageService.clear();

        // stop here if form is invalid
        if (this.changePasswordForm.invalid) return;
        if (!this.currentUser) return;

        this.loading = true;

        // trying to change password
        this.userService.changePassword(
                this.currentUser.user_id.toString(), 
                {
                    old_password : this.f.get('old_password')?.value,
                    password : this.f.get('password')?.value 
                }
            )
            .subscribe({
            next:(data) => {
                // success, password changed, 
                // closing window
                this.loading = false;
                this.toastService.toast('success', 'Успешно!', 'Пароль изменен');
                this.dialogRef.close();
            },
            error:(err) => {
                this.loading = false;

                // display each error as message
                for (let key in err.error) {
                    let errors = err.error[key];
                    errors.forEach((message:string) => {
                        this.messageService.add({severity:'error', summary: message});
                    });
                }
            }
        });
    }
}