import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {config} from 'src/app/constants/config';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(protected http: HttpClient, @Inject("path") protected path: string) {
    }

    getAll(keyword?: string, startDate?: string, endDate?: string, headers?: HttpHeaders, perPage?: number, page?: number): Observable<any> {
        let url = config.SERVER + this.path;

        const queryParams: string[] = [];

        if (startDate) {
            queryParams.push(`StartOfRent=${startDate}`);
        }

        if (endDate) {
            queryParams.push(`EndOfRent=${endDate}`);
        }

        if (keyword) {
            queryParams.push(`Keyword=${keyword}`);
        }

        if (perPage) {
            queryParams.push(`PerPage=${perPage}`);
        }

        if (page) {
            queryParams.push(`Page=${page}`);
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        //console.log(url);
        return this.http.get(url, {headers});
    }


    get(id: number | string, headers?: HttpHeaders): Observable<any> {
        return this.http.get(config.SERVER + this.path + "/" + id, {headers});
    }

    create(dataToSend: any, headers?: HttpHeaders): Observable<any> {
        return this.http.post(config.SERVER + this.path, dataToSend, {headers});
    }

    update(dataToSend: any, headers?: HttpHeaders): Observable<any> {
        return this.http.put(config.SERVER + this.path, dataToSend, {headers});
    }

    delete(id: number | string, headers?: HttpHeaders): Observable<any> {
        return this.http.delete(config.SERVER + this.path + "/" + id, {headers});
    }
}
