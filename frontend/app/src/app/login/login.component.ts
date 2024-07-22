import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    providers: [DialogService, MessageService]
})
export class LoginComponent {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _authService: AuthService,
        private messageService: MessageService,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) { 

        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // reset login status
        this._authService.logout();

        // get return url from route parameters for redirecting after login
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // getter for easy access to form 
    get f() { return this.loginForm; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        let validated_data = {
            username: this.f.get('username')?.value,
            password: this.f.get('password')?.value
        }

        this.loading = true;

        // trying to log in
        this._authService.login(validated_data.username, validated_data.password)
            .pipe(first())
            .subscribe({
                next: data => {
                    // success, user logged in
                    // redirecting and closing window
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;
                    this.dialogRef.close();
                },
                error: error => {
                    this.loading = false;
                    this.messageService.add({severity:'error', life: 3000 ,summary: error.statusText});
                },
            });
    }
}
