import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CarService} from "../../../components/cars/services/cars/car.service";
import {HttpHeaders} from "@angular/common/http";
import {AddPriceService} from "./services/add-price.service";
import {TitleService} from "../../../shared/services/title/title.service";


@Component({
    selector: 'app-admin-add-price',
    templateUrl: './admin-add-price.component.html',
    styleUrls: ['./admin-add-price.component.css']
})
export class AdminAddPriceComponent implements OnInit {
    constructor(
        private carServices: CarService,
        private addPriceService: AddPriceService,
        private titleService: TitleService
    ) {
    }

    addPriceForm!: FormGroup; // Add ! to indicate it will be initialized in ngOnInit
    cars: any = [];
    dataToSend: any = {};


    ngOnInit(): void {

        this.titleService.setPageTitle('Add car price');
        this.addPriceForm = new FormGroup({
            selectedCar: new FormControl(null, [Validators.required]),
            pricePerDay: new FormControl(null, [Validators.required, Validators.min(15)]),
            pricePerMonth: new FormControl(null, [Validators.required, Validators.min(150)]),
        });

        this.carServices.getAll(undefined, undefined, undefined, undefined, 1000).subscribe({
            next: (data: any) => {
                this.cars = data;
                console.log(this.cars);
            },
            error: (err: any) => {
                console.log(err);
            }
        });

        // if (!this.hasToken()) {
        //   const loginMessage = document.getElementById("formSubmitException");
        //   if (loginMessage) {
        //     loginMessage.innerHTML = "You need to be logged in to rent a car!";
        //   }
        // }

    }

    submitForm() {
        if (this.addPriceForm.valid) {
            // Handle form submission here
            const selectedCar = this.addPriceForm.get('selectedCar')?.value;
            const pricePerDay = this.addPriceForm.get('pricePerDay')?.value;
            const pricePerMonth = this.addPriceForm.get('pricePerMonth')?.value;

            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

            this.dataToSend = {
                pricePerDay: pricePerDay,
                pricePerMonth: pricePerMonth,
                carId: selectedCar
            }
            let formSubmitException = document.getElementById("formSubmitException");


            this.addPriceService.create(this.dataToSend, headers).subscribe({
                next: (data: any) => {
                    this.addPriceForm.reset();
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