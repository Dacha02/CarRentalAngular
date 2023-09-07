import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent {

  @Input() carModel: string = '';
  @Input() carManufacturer: string = '';
  @Input() pricePerDay: number = 0;
  @Input() carCategory: string = '';
  @Input() carId: number = 0;
  @Input() carImage: string = '';
}
