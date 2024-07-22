import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { catchError, Observable, throwError } from "rxjs";
import { EnvironmentService } from "./environment.service";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(
        private _api: ApiService, 
        private _env: EnvironmentService
    ){
    }
    getUsers() : Observable<User[]> {
        return this._api.get<User[]>(this._env.usersUrl);
    }
    createUser(data: any): Observable<any> {
        return this._api.post(`${this._env.usersUrl}`, data);
    }
    updateUser(id: string, data: any): Observable<any> {
        return this._api.patch(`${this._env.usersUrl}/${id}`, data);
    }
    deleteUser(id: string): Observable<any> {
        return this._api.delete(`${this._env.usersUrl}/${id}`);
    }
    changePassword(id: string, data: any): Observable<any> {
        return this._api.post(`${this._env.usersUrl}/${id}/${this._env.userChangePasswordPostfix}`, data);
    }
}
