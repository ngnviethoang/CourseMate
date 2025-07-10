import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ConfigForApp } from '../../shared/utilities/config-app';
import { EContentType } from '../../shared/enum/econtenttype';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Injectable()

export class TransferHttp {
    private readonly Host: string;
    private baseUrl = environment.baseUrl;

    constructor(
        private http: HttpClient,
        private router: Router) {
        this.Host = this.baseUrl;
    }

    get<T>(url: string, contentType?: EContentType) {
        return this.mapshare(this.http.get<T>(this.Host + url, this.jwt(contentType)));
    }

    getFile(url: string, contentType?: EContentType) {
        // tslint:disable-next-line: prefer-const
        let sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
        let httpHeaders = new HttpHeaders({
            'Content-Type': sContent
        });

        if (LocalStorageConfig.GetUser() != null) {
            // tslint:disable-next-line: prefer-const
            let currentUser = LocalStorageConfig.GetUser();
            const returnToken = currentUser.token;
            if (currentUser && returnToken) {
                httpHeaders = new HttpHeaders(
                    {
                        // tslint:disable-next-line: object-literal-key-quotes
                        'Authorization': `Bearer ${returnToken}`,
                        'Content-Type': sContent
                    }
                );
            }
        }
        // return this.mapshare(this.http.get(this.Host + url, { observe:'response', responseType: 'blob' }));
        return this.http.get(this.Host + url, { headers: httpHeaders, observe: 'response', responseType: 'blob' })
            .pipe(map((res: any) => res));
    }

    post(url: string, body: any, contentType?: EContentType) {
        return this.mapshare(this.http.post(this.Host + url, body, this.jwt(contentType)));
    }

    postUpload(url: string, body: FormData) {
        return (this.mapshare(this.http.post(this.Host + url, body, this.jwtUploadFile())));
    }

    put(url: string, body: any, contentType?: EContentType) {
        return this.mapshare(this.http.put(this.Host + url, body, this.jwt(contentType)));
    }

    putUrl(url: string, contentType?: EContentType) {
        return this.mapshare(this.http.put(this.Host + url, this.jwt(contentType)));
    }

    delete(url: string, contentType?: EContentType) {
        return this.mapshare(this.http.delete(this.Host + url, this.jwt(contentType)));
    }

    private mapshare(data: Observable<any>) {
        return data.pipe(
            map(res => res),
            catchError(error => this.handleAuthError(error))
        );
    }

    private handleAuthError(error: HttpErrorResponse) {
        if (!navigator.onLine) {
            Swal.fire({
                title: 'Có lỗi xảy ra?',
                text: 'Lỗi về đường truyền internet vui lòng kiểm tra lại',
                icon: 'question',
                iconColor: '#1ea6d3',
                confirmButtonColor: '#4b93ff',
                showCancelButton: true
            });
            return throwError(() => error);
        }
        // handle your auth error or rethrow
        if (error.status === 401) {
            ConfigForApp.isLoadingButton = false;
            // this.notification.error('Thông báo lỗi!', 'Code 401: ' + error.statusText + '<br>' + error.error.messenger.message);
            // this.router.navigate(['/error']);
            localStorage.removeItem('currentUser');
            return throwError(() => error);
        }

        if (error.status === 400) {
            ConfigForApp.isLoadingButton = false;
            // this.notification.error('Thông báo lỗi!', 'Thông số truyền vào không có hoặc không đúng <br> Code 400: ' + error.message);
            // this.router.navigate(['/error']);
            Swal.fire({
                title: 'Có lỗi xảy ra?',
                text: `${error.message}- thông số truyền vào có vẻ không đúng, vui lòng load lại trang và đăng nhập lại`,
                icon: 'error',
                iconColor: '#1ea6d3',
                confirmButtonColor: '#4b93ff',
                showCancelButton: true
            });
            return throwError(() => error);
        }

        if (error.status === 500) {
            ConfigForApp.isLoadingButton = false;
            if (error.error.messenger == null || undefined) {

                Swal.fire({
                    title: 'Có lỗi xảy ra?',
                    text: `${error.message}`,
                    icon: 'question',
                    iconColor: '#1ea6d3',
                    confirmButtonColor: '#4b93ff',
                    showCancelButton: true
                });
                return throwError(() => error);

            } else {
                Swal.fire({
                    title: 'Có lỗi xảy ra?',
                    text: `${error.error.messenger.message}`,
                    icon: 'question',
                    iconColor: '#1ea6d3',
                    confirmButtonColor: '#4b93ff',
                    showCancelButton: true
                });
                return throwError(() => error);
            }
        } else if (error.status === 0) {
            ConfigForApp.isLoadingButton = false;
            Swal.fire({
                title: 'Có lỗi xảy ra?',
                text: `${error.message}`,
                icon: 'question',
                iconColor: '#1ea6d3',
                confirmButtonColor: '#4b93ff',
                showCancelButton: true
            });
            return throwError(() => error);
        }
        return throwError(() => error);
    }

    private jwt(contentType?: EContentType) {
        // create authorization header with jwt token
        const sContent: string = this.contentType(contentType === undefined ? EContentType.json : contentType);
        let httpHeaders = new HttpHeaders({
            'Content-Type': sContent
        });

        if (LocalStorageConfig.GetUser() != null) {
            // tslint:disable-next-line: prefer-const
            let currentUser = LocalStorageConfig.GetUser();
            const returnToken = currentUser.token;
            if (currentUser && returnToken) {
                httpHeaders = new HttpHeaders(
                    {
                        // tslint:disable-next-line: object-literal-key-quotes
                        'Authorization': 'Bearer ' + returnToken,
                        'Content-Type': sContent
                    }
                );
            }
        }
        return { headers: httpHeaders };
    }


    private jwtUploadFile() {
        // create authorization header with jwt token

        let httpHeaders = new HttpHeaders();
        const sContent = this.contentType(EContentType.formdata);

        if (LocalStorageConfig.GetUser() != null) {
            // tslint:disable-next-line: prefer-const
            let currentUser = LocalStorageConfig.GetUser();
            const returnToken = currentUser.token;
            if (currentUser && returnToken) {
                httpHeaders = new HttpHeaders(
                    {
                        // tslint:disable-next-line: object-literal-key-quotes
                        'Authorization': 'Bearer ' + returnToken
                    }
                );
            }
        }
        return { headers: httpHeaders };
    }

    private contentType(typeValue: EContentType) {
        // tslint:disable-next-line: prefer-const
        let result = 'application/json; charset=utf-8';
        switch (typeValue) {
            case EContentType.json:
                return result;
            case EContentType.urlencoded:
                return 'application/x-www-form-urlencoded; charset=utf-8';
            case EContentType.formdata:
                return 'multipart/form-data';
            default:
                return result;
        }
    }
}
