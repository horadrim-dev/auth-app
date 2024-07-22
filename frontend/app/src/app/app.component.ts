import { Component, OnInit } from '@angular/core';
import { User } from './shared/models/user.model';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoginComponent } from './login/login.component';
import { PrimeNGConfig } from 'primeng/api';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ToastService, DialogService]
})
export class AppComponent implements OnInit {
  title = 'Angular DjangoREST JWT Auth app';

  currentUser: User | null = null;
  userMenuItems: MenuItem[];
  ref: DynamicDialogRef | undefined;

  constructor(
    private router: Router,
    private _authService: AuthService,
    public dialogService: DialogService,
    private primengConfig: PrimeNGConfig
  ) {
    this._authService.currentUser.subscribe(x => this.currentUser = x)

    this.userMenuItems = [
      {
        label: 'Профиль',
        routerLink: '/profile',
      },
      {
        label: 'Выйти',
        command: () => {
          this.logout();
        }
      }
    ];
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  isRegisterPageActive(): boolean {
    return this.router.url.startsWith('/register') ? true : false
  }

  loginDialog() {
    this.ref = this.dialogService.open(LoginComponent, { header: 'Вход', width: '20vw', });
  }

  logout() {
    this._authService.logout();
    this.router.navigate(['/']);
  }
}
