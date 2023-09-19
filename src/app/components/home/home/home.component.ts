import {Component, NgModule, OnInit} from '@angular/core';
import {AfterViewInit, Renderer2} from '@angular/core';
import {forkJoin, Observable, Subscription} from "rxjs";
import {CarService} from "../../cars/services/cars/car.service";
import {RentCarService} from "../../cars/services/rentCar/rent-car.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpHeaders} from "@angular/common/http";
import { Meta } from '@angular/platform-browser';
import {TitleService} from "../../../shared/services/title/title.service";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})


export class HomeComponent implements AfterViewInit, OnInit {
    subscription: Subscription = new Subscription();

    rentForm!: FormGroup;
    previousDates: { pickUpDate: string | null, dropOffDate: string | null };

    constructor(
        private renderer: Renderer2,
        private carServices: CarService,
        private rentCarServie: RentCarService,
        private jwtHelper: JwtHelperService,
        private titleService: TitleService,
        private metaService: Meta
    ) {
        this.previousDates = {
            pickUpDate: null,
            dropOffDate: null
        };
        this.metaService.updateTag({ name: 'description', content: 'Home' });

    }


    cars: any = [];
    carsForSlider: any = [];
    dataToSend: any = {};
    userId: number = 0;

    imgUrls: any = [];


    /*cars: ICar[] = [];
    models: IModel[] = [];
    manufacturers: IManufacturer[] = [];*/

    ngOnInit(): void {
        this.titleService.setPageTitle('Home')

        this.rentForm = new FormGroup({
            pickUpLocation: new FormControl('', Validators.required),
            pickUpDate: new FormControl('', [Validators.required, this.startDateValidator]),
            dropOffDate: new FormControl('', [Validators.required, this.endDateValidator.bind(this)]),
            selectedCar: new FormControl('', Validators.required)
        });

        this.carServices.getAll(undefined, undefined, undefined, undefined, 4, 1).subscribe({
            next: (data: any) => {
                this.cars = data;
                this.carsForSlider = data;
                console.log(this.cars);
            },
            error: (err: any) => {
                console.log(err);
            }
        });

        if (!this.hasToken()) {
            const loginMessage = document.getElementById("formSubmitException");
            let button = document.getElementById("rentCarBtn") as HTMLButtonElement;
            if (button) {
                button.disabled = true;
            }
            if (loginMessage) {
                loginMessage.innerHTML = "You need to be logged in to rent a car!";
            }
        }

        const apiKey = 'y7ZJohrsKbAX7BfHG4AR3k5clFCknL3cBpz5764zrzsqbpfG6IzAgRVS';
        const query = 'car'; // Your query for car images
        const width = 200; // Desired width
        const height = 200; // Desired height

        fetch(`https://api.pexels.com/v1/search?query=${query}&width=${width}&height=${height}&per_page=55`, {
            method: 'GET',
            headers: {
                'Authorization': apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.photos && data.photos.length > 0) {
                    this.imgUrls = data;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    rndImage(id: number): string {
        if (this.imgUrls && this.imgUrls.photos && this.imgUrls.photos[id] && this.imgUrls.photos[id].src) {
            return this.imgUrls.photos[id].src.large;
        } else {
            // Handle the case where the properties are not defined or return a default value.
            return '../../../../assets/templateImages/car-1.jpg';
        }
    }

    startDateValidator = (control: FormControl): { [key: string]: any } | null => {
        if (!this.rentForm) {
            return null;
        }

        const currentDate = new Date();
        const startDate = new Date(control.value);

        if (startDate < currentDate) {
            return {startDateInPast: true};
        }

        return null;
    };

    isDatesValid(): boolean {
        const pickUpDateControl = this.rentForm.get('pickUpDate');
        const dropOffDateControl = this.rentForm.get('dropOffDate');
        const selectedCarControl = this.rentForm.get('selectedCar');

        if (!pickUpDateControl || !dropOffDateControl || !selectedCarControl) {
            return false;
        }

        const pickUpDate = pickUpDateControl.value;
        const dropOffDate = dropOffDateControl.value;
        const areDatesValid = pickUpDateControl.valid && dropOffDateControl.valid;

        if (areDatesValid && pickUpDate && dropOffDate) {
            selectedCarControl.enable();

            // Check if the dates have changed
            const previousPickUpDate = this.previousDates.pickUpDate;
            const previousDropOffDate = this.previousDates.dropOffDate;
            const datesHaveChanged = pickUpDate !== previousPickUpDate || dropOffDate !== previousDropOffDate;

            if (datesHaveChanged) {
                this.carServices.getAll('', pickUpDate, dropOffDate,undefined,100,1).subscribe({
                    next: (data: any) => {
                        this.cars = data;
                        console.log(this.cars);
                    },
                    error: (err: any) => {
                        console.log(err);
                    }
                });
            }

            // Update the previous dates
            this.previousDates.pickUpDate = pickUpDate;
            this.previousDates.dropOffDate = dropOffDate;

            return true;
        } else {
            selectedCarControl.setValue('');
            selectedCarControl.disable();
            return false;
        }
    }


    endDateValidator = (control: FormControl): { [key: string]: any } | null => {
        if (!this.rentForm) {
            return null;
        }

        const startDate = this.rentForm.get('pickUpDate')?.value;
        const endDate = control.value;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                return {endDateLessThanStartDate: true};
            }
        }

        const end = new Date(endDate);
        if (end < new Date()) {
            return {endDateInPast: true};
        }
        return null;
    };

    hasToken(): boolean {
        const token  = localStorage.getItem('token');

        return !!token;

    }


    submitForm() {
        if (!this.hasToken()) {
            const loginMessage = document.getElementById("formSubmitException");
            this.rentForm.setErrors({ 'invalid': true });
            let button = document.getElementById("rentCarBtn") as HTMLButtonElement;
            if (button) {
                button.disabled = true;
            }
            if (loginMessage) {
                loginMessage.innerHTML = "You need to be logged in to rent a car!";
            }
        }else {
            if (this.rentForm.valid) {
                const pickUpLocation = this.rentForm.get('pickUpLocation')?.value;
                const pickUpDate = this.rentForm.get('pickUpDate')?.value;
                const dropOffDate = this.rentForm.get('dropOffDate')?.value;
                const selectedCar = this.rentForm.get('selectedCar')?.value;

                let formSubmitException = document.getElementById("formSubmitException");

                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = this.jwtHelper.decodeToken(token);
                    this.userId = decodedToken.UserId;

                    this.dataToSend = {
                        CarId: selectedCar,
                        StartDate: pickUpDate,
                        EndDate: dropOffDate,
                        RentAdress: pickUpLocation
                    }
                } else {
                    this.rentForm.invalid;
                }
                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

                this.rentCarServie.create(this.dataToSend, headers).subscribe({
                    next: (data: any) => {
                        this.rentForm.reset();
                        if (formSubmitException) {
                            formSubmitException.innerHTML = "You successfully rented a car!";
                        }
                        setTimeout(() => {
                            if (formSubmitException) {
                                formSubmitException.classList.remove("text-white");
                                formSubmitException.innerHTML = "";
                            }
                        }, 3000); // Hide the message after 5 seconds
                    },
                    error: (err: any) => {
                        console.log(err.error.errors[0].error);
                        if (formSubmitException) {
                            formSubmitException.innerHTML = err.error.errors[0].error;
                        }
                    }
                });
            }
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
