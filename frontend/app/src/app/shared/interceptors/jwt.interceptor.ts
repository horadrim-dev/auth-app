import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, pipe, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators'
import { AuthService } from '../services/auth.service';
import { EnvironmentService } from '../services/environment.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService, private _envService: EnvironmentService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // intercept only if user is logged in
    if (!this._authService.isLoggedIn) return next.handle(request);

    // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this._authService.currentUserValue;
    const isLoggedIn = Boolean(currentUser && currentUser.token);
    const isApiUrl = Boolean(request.url.startsWith(this._envService.urlAddress));

    if (isLoggedIn
      && isApiUrl
      && currentUser
      && request.url != `${this._envService.urlAddress}/${this._envService.jwtRefresh}`
      && request.url != `${this._envService.urlAddress}/${this._envService.jwtLogin}`
    ) {

      console.log('[JWT] added token to request: ', request.method, request.url)

      //add auth request headers
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        console.log('[JWT] catched error: ', error)

        // We do check to see if refresh token failed
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)
          && request.url === `${this._envService.urlAddress}/${this._envService.jwtRefresh}`) {

          // We cathed error during refreshing token
          // In this case we want to logout user
          console.log('[JWT] throw 1: refresh token too old or wrong, logout');
          this._authService.logout();
          return throwError(() => new Error(error.message));

        } else if (error instanceof HttpErrorResponse && error.status === 401) {

          // trying to refresh token
          console.log('[JWT] throw 2: token too old, start refreshing');
          return this.handle401Error(request, next);
        } else {

          // some another kind error, throwing further
          console.log('[JWT] throw 3: "not my problem" error, throw further: ');
          return throwError(() => error);
        }
      })
    )
  }


  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // 401 error handler
  // we got 401 error, so refresh token too old
  // start refreshing operation
  // if we already done refreshing - add token and retry request
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      console.log('[JWT] start tokens refreshing');

      // trying to refresh tokens
      return this._authService.refreshToken().pipe(
        switchMap((token: any) => {
          // new tokens are retrieved
          this.isRefreshing = false;
          console.log('[JWT] tokens are refreshed');

          this.refreshTokenSubject.next(token.refresh);

          return next.handle(this.addToken(request, token.refresh));
        }));

    } else {
      // refreshing operation is done, 
      // so now we are gonna add fresh token to request
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
  
  // adding token to request
  private addToken(request: HttpRequest<any>, token: string) {
    const currentUser = this._authService.currentUserValue;
    if (currentUser) {
      console.log('[JWT] fresh token added to request', request.url)
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer  ${currentUser.token}`
        }
      });
    }
    else return request
  }
}
