import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {Data} from "../../../../shared/constants/data";
import {HttpClient} from "@angular/common/http";
import {IModel} from "../../interfaces/i-model";

@Injectable({
  providedIn: 'root'
})
export class ModelService extends ApiService{

  constructor(http: HttpClient) {
    super(http, Data.Models)
  }
}
