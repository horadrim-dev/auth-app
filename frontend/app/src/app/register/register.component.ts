import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { first } from 'rxjs';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  stepItems: MenuItem[] = [];
  stepIndex: number = 0;
  submitted: boolean = false;
  authDataForm: FormGroup;
  userDataForm: FormGroup;
  loading = false;
  currentUser: User | null = null;


  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);

    this.authDataForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, {
      validators: this.requireConfirmPasswordValidator
    });
    this.userDataForm = new FormGroup({
      first_name: new FormControl('', []),
      last_name: new FormControl('', []),
    }, {});
  }

  // validator checks that password and confirmPassword fields are same
  requireConfirmPasswordValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password !== confirmPassword ? { requireConfirmPassword: true } : null;
  };

  ngOnInit(): void {
    this.stepIndex = 0;

    // steps data
    this.stepItems = [
      { label: 'Учетные данные', },
      { label: 'Укажите информацию о себе', },
    ];
  }

  nextStep() {
    this.stepIndex++;
    this.submitted = false;
  }

  // submitting step #1 form with auth data
  onSubmitAuthDataForm() {

    this.submitted = true;
    this.messageService.clear();

    // stop here if form is invalid
    if (this.authDataForm.invalid) return;

    this.loading = true;

    let validated_data = {
      username: this.authDataForm.get('username')?.value,
      password: this.authDataForm.get('password')?.value
    }

    // creating user with provided form data
    this.userService.createUser(validated_data)
      .subscribe({
        next: (data) => {
          // User created. 
          // Now we have to log In, 
          // because only profile's owner able to update profile data
          // and we need to get access token
          this.authService.login(validated_data.username, validated_data.password)
            .pipe(first())
            .subscribe({
              next: data => {
                // We are now signed in
                // Going to next step
                this.loading = false;
                this.nextStep();
              },
              error: error => {
                this.loading = false;
                this.messageService.add({ key: "step1", severity: 'error', summary: error.statusText });
              },
            });
        },
        error: (err) => {
          this.loading = false;
          // display each error as message
          for (let key in err.error) {
            let errors = err.error[key];
            errors.forEach((message: string) => {
              this.messageService.add({ key: "step1", severity: 'error', summary: message });
            });
          }
        }
      });
  }

  // submitting step #2 form with profile data
  onSubmitUserDataForm() {
    this.submitted = true;
    this.messageService.clear();

    // abort if form is invalid
    if (this.userDataForm.invalid) return;
    // abort if user somehow still not signed in. We need an access token
    if (this.currentUser === null) return;

    this.loading = true;

    let validated_data = {
      first_name: this.userDataForm.get('first_name')?.value,
      last_name: this.userDataForm.get('last_name')?.value
    }

    // updating user's profile with form data
    this.userService.updateUser(this.currentUser.user_id.toString(), validated_data)
      .subscribe({
        next: (data) => {
          // profile successfully updated, redirecting

          // updating current user object
          this.authService.updateUserInfo(validated_data);

          this.loading = false;
          this.toastService.toast("success", "Успешно!", "Регистрация завершена.")
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          // display each error as message
          for (let key in err.error) {
            let errors = err.error[key];
            errors.forEach((message: string) => {
              this.messageService.add({ key: "step2", severity: 'error', summary: message });
            });
          }
        }
      });
  }
}