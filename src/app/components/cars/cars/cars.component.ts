import {AfterViewInit, Component, Renderer2, OnInit} from '@angular/core';
import {CarService} from "../services/cars/car.service";
import {forkJoin, of, Observable, Subscription} from "rxjs";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {TitleService} from "../../../shared/services/title/title.service";


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})


export class CarsComponent implements AfterViewInit, OnInit {

  subscription: Subscription = new Subscription();
  constructor(
    private renderer: Renderer2,
    private carServices: CarService,
    private titleService: TitleService
  ) {
  }

  cars: any = [];
  pagesCount: any[] = [];
  keyword: string = '';
  filterForm! :FormGroup;
  imgUrls: any = [];

  ngOnInit(): void {
    this.titleService.setPageTitle('Cars')
    this.filterForm = new FormGroup({
      keyword: new FormControl(),
      perPage: new FormControl('15'),
      pickUpDate: new FormControl('', [this.startDateValidator.bind(this)]),
      dropOffDate: new FormControl('', [this.endDateValidator.bind(this)]),
    });

    this.carServices.getAll().subscribe({
      next: (data: any) =>{
        this.cars = data;
        this.pagesCount = Array.from({ length: this.cars.pagesCount }, (_, i) => i + 1);
        console.log(this.cars);
      },
      error: (err: any)=>{
        console.log(err);
      }
    });

    const apiKey = 'y7ZJohrsKbAX7BfHG4AR3k5clFCknL3cBpz5764zrzsqbpfG6IzAgRVS';
    const query = 'car'; // Your query for car images
    const width = 200; // Desired width
    const height = 200; // Desired height

    fetch(`https://api.pexels.com/v1/search?query=${query}&width=${width}&height=${height}&per_page=30`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    })
        .then(response => response.json())
        .then(data => {
          // Handle the API response here, which contains the list of images
          //console.log(data);
          if (data.photos && data.photos.length > 0) {
            this.imgUrls = data; // Update imgUrl with the image URL
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
  }

  startDateValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!this.filterForm) {
      return null;
    }

    const currentDate = new Date();
    const startDate = new Date(control.value);

    if (startDate < currentDate) {
      return { startDateInPast: true };
    }

    return null;
  };

  endDateValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!this.filterForm) {
      return null;
    }

    const startDate = this.filterForm.get('pickUpDate')?.value;
    const endDate = control.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        return { endDateLessThanStartDate: true };
      }
    }

    const end = new Date(endDate);
    if (end < new Date()) {
      return { endDateInPast: true };
    }

    return null;
  };
  submitForm() {
    if (this.filterForm.valid) {
      const keyword = this.keyword;
      const pickUpDate = this.filterForm.get('pickUpDate')?.value;
      const dropOffDate = this.filterForm.get('dropOffDate')?.value;
      const perPage = this.filterForm.get('perPage')?.value;

      this.carServices.getAll(keyword, pickUpDate, dropOffDate, undefined,perPage).subscribe({
        next: (data: any) =>{
          this.cars = data;
          this.pagesCount = Array.from({ length: this.cars.pagesCount }, (_, i) => i + 1);
          console.log(data);
        },
        error: (err: any)=>{
          console.log(err);
        }
      });
    }else {

    }
  }

  goToPage(page: number) {
    const keyword = this.keyword;
    const pickUpDate = this.filterForm.get('pickUpDate')?.value;
    const dropOffDate = this.filterForm.get('dropOffDate')?.value;
    const perPage = this.filterForm.get('perPage')?.value;

    this.carServices.getAll(keyword, pickUpDate, dropOffDate, undefined, perPage, page).subscribe({
      next: (data: any) => {
        this.cars = data;
        console.log(data);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  previousPage() {
    const currentPage = this.cars.currentPage;
    if (currentPage > 1) {
      this.goToPage(currentPage - 1);
    }
  }

  nextPage() {
    const currentPage = this.cars.currentPage;
    const totalPages = this.pagesCount.length;
    if (currentPage < totalPages) {
      this.goToPage(currentPage + 1);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const script = this.renderer.createElement('script');
      script.src = '../../../../assets/templateJS/main.js';
      this.renderer.appendChild(document.body, script);
    }, 1000)
  }

}
