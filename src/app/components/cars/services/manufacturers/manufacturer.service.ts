import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {Data} from "../../../../shared/constants/data";
import {HttpClient} from "@angular/common/http";
import {IManufacturer} from "../../interfaces/i-manufacturer";

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService extends ApiService{

  constructor(http: HttpClient) {
    super(http, Data.Manufacturers)
  }
}
