import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MenuModule } from 'primeng/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { ToastModule } from 'primeng/toast';
import { RegisterComponent } from './register/register.component';
import { StepsModule } from 'primeng/steps';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    DynamicDialogModule,
    MessagesModule,
    ToastModule,
    StepsModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
