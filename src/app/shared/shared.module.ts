import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import {PricePipe} from "./pipes/price/price.pipe";
import {TitleService} from "./services/title/title.service";

@NgModule({
  declarations: [PricePipe],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  providers: [TitleService],
  exports: [PricePipe]
})
export class SharedModule { }
