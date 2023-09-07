import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {HttpClient} from "@angular/common/http";
import {Data} from "../../../../shared/constants/data";
import {ISpecSpecValues} from "../../interfaces/i-spec-spec-values";

@Injectable({
  providedIn: 'root'
})

export class CarSpecificationService extends ApiService{

  constructor(http: HttpClient) {
    super(http, Data.CarSpecifications)
  }
}
