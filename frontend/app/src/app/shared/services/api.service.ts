import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvironmentService } from "./environment.service";
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";

export interface ApiRequestOptions {
  headers: Record<string, any>;
  params: Record<string, any>;
  reportProgress: boolean;
  observe: any;
  responseType: any;
  withCredentials: boolean;
}

export function getApiRequestOptions(options?: Partial<ApiRequestOptions>): Partial<ApiRequestOptions> | undefined {
  if (options) {
    let params: Record<string, any> = {};
    let headers: Record<string, any> = {};
    if (options.headers) {
      headers = !(options?.headers instanceof HttpHeaders) ? new HttpHeaders(options.headers) : options.headers;
    }

    return { ...options, params, headers };
  }

  return;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private readonly httpClient: HttpClient, 
        private env: EnvironmentService,
        private router: Router
    ){
    }

    makeUrl(url: string): string {
        return url.indexOf('http') === 0 ? url : `${this.env.urlAddress}/${url}`;
    }

    get<T = void>(url: string, options?: Partial<ApiRequestOptions>): Observable<T> {
        return this.httpClient.get<T>(
                this.makeUrl(url), 
                getApiRequestOptions(options)
            )
            .pipe(catchError(this.errorHandler));
    }

    post<T = void>(url: string, body?: unknown | null, options?: Partial<ApiRequestOptions>): Observable<T> {
        return this.httpClient.post<T>(
                this.makeUrl(url), 
                body ?? null, 
                getApiRequestOptions(options)
            )
            .pipe(catchError(this.errorHandler));
    }

    patch<T = void>(url: string, body: unknown | null, options?: Partial<ApiRequestOptions>): Observable<T> {
        return this.httpClient.patch<T>(
                this.makeUrl(url), body, getApiRequestOptions(options)
            )
            .pipe(catchError(this.errorHandler));
    }

    put<T = void>(url: string, body: unknown | null, options?: Partial<ApiRequestOptions>): Observable<T> {
        return this.httpClient.put<T>(
                this.makeUrl(url), 
                body, 
                getApiRequestOptions(options)
            )
            .pipe(catchError(this.errorHandler));
    }

    delete<T = void>(url: string, options?: Partial<ApiRequestOptions>): Observable<T> {
        return this.httpClient.delete<T>(
                this.makeUrl(url), 
                getApiRequestOptions(options)
                )
                .pipe(catchError(this.errorHandler));
    }

    errorHandler = (error: any) => {
        let catched: boolean = false;
        let errorMessage: string = "";

        console.error('[API] catched error: ', error);

        if (error instanceof HttpErrorResponse) {
            if (error.error instanceof ErrorEvent) {
                console.error("[API] Error Event, do nothing ");
            } else {
                switch (error.status) {
                    case 401:      //login
                        errorMessage = "Не удалось выполнить авторизацию. Проверьте учетные данные."
                        catched = true;
                        break;
                    case 403:     //forbidden
                        errorMessage = "Доступ запрещен."
                        catched = true;
                        break;
                    case 404:     
                        console.log(`[API] redirect to 404`);
                        this.router.navigate(["/404"]);
                        break;
                }
            }
        }
        else {
          console.log("[API] Not HttpError, do nothing");
        }
 
        if (catched) {
            console.log(`[API] catch ` + error.status + ` and throw to subscriber`);
            return throwError(() => new HttpErrorResponse({statusText: errorMessage, status: error.status}));
        } else {
            console.log('[API] throw unknown error to the subscriber', error);
            return throwError(() => error);
        }
    }
}