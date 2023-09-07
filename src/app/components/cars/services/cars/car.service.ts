import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {Data} from "../../../../shared/constants/data";
import {ICar} from "../../interfaces/i-car";
import {HttpClient} from "@angular/common/http";
import {apis} from "../../../../constants/apis";

@Injectable({
  providedIn: 'root'
})
export class CarService extends ApiService{

  constructor(http: HttpClient) {
    super(http, apis.featuredCars)
  }
}
