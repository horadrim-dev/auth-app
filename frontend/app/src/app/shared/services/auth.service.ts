import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { EnvironmentService } from './environment.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(
        private _api: ApiService, 
        private _env: EnvironmentService
    ) {
        let storedUser = localStorage.getItem('auth-data')
        this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null)
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get isLoggedIn(): boolean {
        return this.currentUserValue ? true : false
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    // update info for logged in user object
    updateUserInfo(data: any) {
        this.currentUserSubject.next(
            Object.assign(this.currentUserSubject.value as User, data)
        );
        // save changed data
        localStorage.setItem('auth-data', JSON.stringify(this.currentUserValue));
    }

    login(username: string, password: string) {
        return this._api.post<any>(`${this._env.jwtLogin}`, { username, password })
            .pipe(
                map(response => {
                    let currentUser: User;

                    // login successful if there's a jwt token in the response
                    if (response.access) {

                        // store user details and jwt token in local storage 
                        // to keep user logged in between page refreshes
                        currentUser = jwtDecode(response.access);
                        currentUser.token = response.access;
                        currentUser.refreshToken = response.refresh;

                        this.currentUserSubject.next(currentUser);

                        // save auth user data
                        localStorage.setItem('auth-data', JSON.stringify(currentUser));

                        console.log('[AUTH] loggged in as: ', JSON.stringify(currentUser));
                    }
                    return response
                }),
            )
    }

    refreshToken() {
        const refreshToken = this.currentUserValue!.refreshToken

        return this._api.post<any>(`${this._env.jwtRefresh}`, { 'refresh': refreshToken })
            .pipe(
                map(response => {
                    let currentUser: User;

                    // login successful if there's a jwt token in the response
                    if (response.access) {
                        // store user details and jwt token in local storage 
                        // to keep user logged in between page refreshes
                        currentUser = jwtDecode(response.access)
                        currentUser.token = response.access
                        currentUser.refreshToken = response.refresh

                        this.currentUserSubject.next(currentUser);

                        //save data
                        localStorage.setItem('auth-data', JSON.stringify(currentUser));
                    }
                    return response
                }),
            )
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('auth-data');
        this.currentUserSubject.next(null);
    }
}
