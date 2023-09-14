import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent implements OnInit{

  @Input() carModel: string = '';
  @Input() carManufacturer: string = '';
  @Input() pricePerDay: number = 0;
  @Input() carCategory: string = '';
  @Input() carId: number = 0;
  @Input() carImage: any = [];

  imgUrl: string = '';

  ngOnInit(): void{

    // let rnd = Math.floor(Math.random() * 28);
    // this.imgUrl = this.carImage.photos[rnd].src.large;
  }

 /* rndImage(id: number): string{
    return this.carImage.photos[id]?.src?.large || this.carImage.photos[0]?.src?.large;
  }*/

  rndImage(id: number): string {
    if (this.carImage && this.carImage.photos && this.carImage.photos[id] && this.carImage.photos[id].src) {
      return this.carImage.photos[id]?.src.large;
    } else {
      // Handle the case where the properties are not defined or return a default value.
      return '../../../../assets/templateImages/car-1.jpg';
    }
  }

}
