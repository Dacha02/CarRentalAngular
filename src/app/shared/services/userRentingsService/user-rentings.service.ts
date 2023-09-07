import { Injectable } from '@angular/core';
import {ApiService} from "../api-service.service";
import {HttpClient} from "@angular/common/http";
import {apis} from "../../../constants/apis";

@Injectable({
  providedIn: 'root'
})
export class UserRentingsService extends ApiService{

  constructor(http: HttpClient) {
    super(http, apis.userRentings)
  }
}
