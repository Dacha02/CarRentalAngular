import { Injectable } from '@angular/core';
import {ApiService} from "../../../../../shared/services/api-service.service";
import {HttpClient} from "@angular/common/http";
import {apis} from "../../../../constants/adminApis";

@Injectable({
  providedIn: 'root'
})
export class DeactivateCarService extends ApiService{

  constructor(http: HttpClient) {
    super(http, apis.deactivateCar)
  }
}
