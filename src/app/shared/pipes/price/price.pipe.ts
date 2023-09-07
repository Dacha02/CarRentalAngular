import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: number): string {
    let fomratedPrice = value.toFixed(2);
    return `${fomratedPrice}€`;
  }

}
