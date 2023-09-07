import { Injectable } from '@angular/core';
import {ApiService} from "../api-service.service";
import {HttpClient} from "@angular/common/http";
import {apis} from "../../../admin/constants/adminApis";
import {Observable} from "rxjs";
import {config} from "../../../constants/config";

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService extends ApiService{

  constructor(http: HttpClient) {
    super(http, apis.tokenRefresh)
  }
}
