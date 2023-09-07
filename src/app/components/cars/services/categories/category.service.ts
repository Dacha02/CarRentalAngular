import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api-service.service";
import {HttpClient} from "@angular/common/http";
import {Data} from "../../../../shared/constants/data";
import {ICategory} from "../../interfaces/i-category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiService{

  constructor(http: HttpClient) {
    super(http, Data.Categories)
  }
}
