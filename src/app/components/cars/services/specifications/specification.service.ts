import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {HttpClient} from "@angular/common/http";
import {Data} from "../../../../shared/constants/data";
import {ISpecification} from "../../interfaces/i-specification";

@Injectable({
  providedIn: 'root'
})
export class SpecificationService extends ApiService{

  constructor(http: HttpClient) {
    super(http, Data.Specifications)
  }
}
