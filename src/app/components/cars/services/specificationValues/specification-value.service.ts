import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {HttpClient} from "@angular/common/http";
import {Data} from "../../../../shared/constants/data";
import {ISpecificationValues} from "../../interfaces/i-specification-values";

@Injectable({
  providedIn: 'root'
})
export class SpecificationValueService extends ApiService{

  constructor(http: HttpClient) {
    super(http, Data.SpecificationValues)
  }
}
