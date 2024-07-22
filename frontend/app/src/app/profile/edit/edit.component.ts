import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [MessageService]
})
export class EditComponent  {

  form: FormGroup;
  submitted = false;
  currentUser: User|null = null;

  constructor(
    public fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router:Router,
    private authService : AuthService,
    private userService: UserService,
  ){
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      first_name: ['', []],
      last_name: ['', []],
    });

    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.f.controls['username'].setValue(this.currentUser?.username);
      this.f.controls['first_name'].setValue(this.currentUser?.first_name);
      this.f.controls['last_name'].setValue(this.currentUser?.last_name);
    })
  }

  // event for back button
  back(){
    this.router.navigate(['../'], { relativeTo: this.route});
    return false;
  }

  // getter for easy access to form
  get f() { return this.form; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) return;
    
    this.updateUser();
  }

  updateUser() {
    if (!this.currentUser) return;

    // trying to update user
    this.userService.updateUser(this.currentUser.user_id.toString(), this.form.value)
    .subscribe({
      next:(data) => {
        // success, user updated
        // update info for current logged user object
        this.authService.updateUserInfo(this.form.value);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error:(err) => {
        // display each error as message
        for (let key in err.error) {
          let errors = err.error[key];
          errors.forEach((message: string) => {
            this.messageService.add({severity: 'error', summary: message });
          });
        }
      }
    });
  }

}
