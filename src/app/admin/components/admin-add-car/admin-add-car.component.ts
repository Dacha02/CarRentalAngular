import {Component, OnInit} from '@angular/core';
import {CarDetailsService} from "./services/carDetails/car-details.service";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AddCarService} from "./services/addCar/add-car.service";
import {HttpHeaders} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";
import {SingleCarService} from "./services/singleCar/single-car.service";
import {TitleService} from "../../../shared/services/title/title.service";

@Component({
    selector: 'app-admin-add-car',
    templateUrl: './admin-add-car.component.html',
    styleUrls: ['./admin-add-car.component.css']
})
export class AdminAddCarComponent implements OnInit {

    previousDates: { startOfReg: string | null };

    constructor(
        private carDetailsService: CarDetailsService,
        private addCarService: AddCarService,
        private router: Router,
        private route: ActivatedRoute,
        private singleCarDetailsService: SingleCarService,
        private titleService: TitleService) {
        this.previousDates = {
            startOfReg: null
        };
    }

    carDetails: any = [];
    addCarForm!: FormGroup;
    groupedSpecifications: any[] = []; // Initialize the array for grouped specifications
    image!: File;

    modelId: number = 0;
    rentPlaceId: number = 0;
    categoryId: number = 0;
    pricePerDay: number = 0;
    pricePerMonth: number = 0;
    registrationPlate: string = '';
    specSpecValues: number[] = [];
    startOfRegistration: Date | null = null;
    endOfRegistration: Date | null = null;

    selectedSpecificationState: { [key: string]: { [key: number]: boolean } } = {};


    ngOnInit(): void {


        this.addCarForm = new FormGroup({
            selectedMakeModel: new FormControl(null, [Validators.required]),
            selectedCategory: new FormControl(null, [Validators.required]),
            selectedRentPlace: new FormControl(null, [Validators.required]),
            pricePerDay: new FormControl(null, [Validators.required]),
            pricePerMonth: new FormControl(null, [Validators.required]),
            registrationPlate: new FormControl(null, [Validators.required]),
            startOfReg: new FormControl('', [Validators.required, this.startDateValidator]),
            image: new FormControl(null, [Validators.required]),
        });

        this.carDetailsService.getAll().subscribe({
            next: (data: any) => {
                this.carDetails = data;
                this.groupedSpecifications = this.groupSpecifications(data.specifications);
                console.log(data)
            },
            error: (err: any) => {
                console.log(err);
            }
        });

        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.titleService.setPageTitle('Change car')

                // Editing an existing car
                console.log('Id:' + id);
                this.fetchCarDetails(id);
            } else {
                this.titleService.setPageTitle('Add car')

                // Adding a new car
                // You can also initialize other form fields here if needed
                console.log('nema id')
            }
        });
    }


    fetchCarDetails(id: number): void {
        // Make an API request to fetch car details based on the id
        this.singleCarDetailsService.get(id).subscribe({
            next: (data: any) => {

                const startOfRegistration = new Date(data.startOfRegistration);
                startOfRegistration.setDate(startOfRegistration.getDate() + 1); // Add one day

                // Format the adjusted date to "yyyy-MM-dd"
                const adjustedDate = startOfRegistration.toISOString().substring(0, 10);

                // Populate the form with fetched data
                this.addCarForm.patchValue({
                    selectedMakeModel: data.modelId,
                    selectedCategory: data.categoryId,
                    selectedRentPlace: data.rentingPlaceId,
                    pricePerDay: data.pricePerDay,
                    pricePerMonth: data.pricePerMonth,
                    registrationPlate: data.registrationPlate,
                    startOfReg: adjustedDate, // Format to "yyyy-MM-dd"
                    // ... Populate other form fields ...
                });


                // Initialize selectedSpecifications with specification IDs
                this.selectedSpecifications = {}; // Clear existing values
                this.idsArray = [];

                for (const specification of data.specifications) {
                    const groupName = specification.specificationName;
                    this.selectedSpecifications[groupName] = specification.id; // Use specification.id
                    this.idsArray.push(specification.id);
                }
                console.log(data);

                // Populate selectedSpecifications and idsArray if needed

                // ... Rest of your code ...
            },
            error: (err: any) => {
                console.log(err);
            }
        });
    }

    isSelected(specName: string, valueId: number): boolean {
        return this.selectedSpecifications[specName] === valueId;
    }

    handleImageInput(event: any) {
        this.image = event.target.files[0];
    }


    selectedSpecifications: { [specName: string]: number } = {};
    idsArray: number[] = [];

    onSpecificationChange(specName: string, valueId: number, event: any) {
        const checked = event.target.checked;

        if (checked) {
            this.selectedSpecifications[specName] = valueId;
        } else {
            delete this.selectedSpecifications[specName];
        }
        this.idsArray = Object.values(this.selectedSpecifications);
        console.log(this.idsArray)
    }

    groupSpecifications(specifications: any[]): any[] {
        const groupedSpecs: any[] = [];

        specifications.forEach(specification => {
            const existingGroup = groupedSpecs.find(group => group.specificationName === specification.specificationName);
            if (existingGroup) {
                existingGroup.specifications.push(specification);
            } else {
                groupedSpecs.push({
                    specificationName: specification.specificationName,
                    specifications: [specification]
                });
            }
        });

        return groupedSpecs;
    }

    startDateValidator = (control: FormControl): { [key: string]: any } | null => {
        if (!this.addCarForm) {
            return null;
        }

        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        const startDate = new Date(control.value);

        if (startDate < sixMonthsAgo) {
            return {startDateTooOld: true};
        }

        if (startDate > oneMonthFromNow) {
            return {startDateTooFuture: true};
        }

        return null;
    };

    isDatesValid(): boolean {
        const startOfRegControl = this.addCarForm.get('startOfReg');
        const selectedCarControl = this.addCarForm.get('selectedCar');

        if (!startOfRegControl || !selectedCarControl) {
            return false;
        }

        const startOfReg = startOfRegControl.value;
        const areDatesValid = startOfRegControl.valid;

        if (areDatesValid && startOfReg) {
            selectedCarControl.enable();

            // Check if the dates have changed
            const previousstartOfReg = this.previousDates.startOfReg;
            const datesHaveChanged = startOfReg !== previousstartOfReg;

            if (datesHaveChanged) {

            }

            // Update the previous dates
            this.previousDates.startOfReg = startOfReg;

            return true;
        } else {
            selectedCarControl.setValue('');
            selectedCarControl.disable();
            return false;
        }
    }


    submitForm() {
        if (this.addCarForm.valid) {
            const formData = new FormData();
            formData.append('Image', this.image);
            formData.append('ModelId', this.addCarForm.get('selectedMakeModel')?.value);
            formData.append('RentPlaceId', this.addCarForm.get('selectedRentPlace')?.value);
            formData.append('CategoryId', this.addCarForm.get('selectedCategory')?.value);
            formData.append('PricePerDay', this.addCarForm.get('pricePerDay')?.value);
            formData.append('PricePerMonth', this.addCarForm.get('pricePerMonth')?.value);
            formData.append('RegistrationPlate', this.addCarForm.get('registrationPlate')?.value);
            formData.append('StartOfRegistration', this.addCarForm.get('startOfReg')?.value);

            const oneYearFromStart = new Date(this.addCarForm.get('startOfReg')?.value);
            oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);
            formData.append('EndOfRegistration', oneYearFromStart.toISOString());

            // Append each specification value to the form data
            this.idsArray.forEach(valueId => {
                formData.append('SpecSpecValues', valueId.toString());
            });


            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            let formSubmitException = document.getElementById("formSubmitException");


            this.route.params.subscribe(params => {
                const id = params['id'];
                if (id) {
                    formData.append('Id', id);
                    this.addCarService.update(formData, headers).subscribe({
                        next: (data: any) => {
                            console.log("Success")
                            if (formSubmitException) {

                                formSubmitException.classList.remove("text-danger");
                                formSubmitException.classList.add("text-white");
                                formSubmitException.innerHTML = "You successfully changed car details!";
                                setTimeout(() => {
                                    if (formSubmitException) {
                                        formSubmitException.classList.remove("text-white");
                                        formSubmitException.innerHTML = "";
                                        this.addCarForm.reset(); // Clear the form
                                        this.router.navigate(['/admin/home']); // Redirect to admin/home
                                    }
                                }, 3000);
                            }
                        },
                        error: (err: any) => {
                            console.log(err);
                            if (formSubmitException) {
                                console.log(err.error.errors)
                                for (let i of err.error.errors) {
                                    formSubmitException.innerHTML += i.error + '<br>';
                                }
                            }
                        }
                    });
                } else {
                    // Adding a new car
                    // You can also initialize other form fields here if needed
                    this.addCarService.create(formData, headers).subscribe({
                        next: (data: any) => {
                            console.log("Success")
                            if (formSubmitException) {

                                formSubmitException.classList.remove("text-danger");
                                formSubmitException.classList.add("text-white");
                                formSubmitException.innerHTML = "You successfully added the car!";
                                setTimeout(() => {
                                    if (formSubmitException) {
                                        formSubmitException.classList.remove("text-white");
                                        formSubmitException.innerHTML = "";
                                        this.addCarForm.reset(); // Clear the form
                                        this.router.navigate(['/admin/home']); // Redirect to admin/home
                                    }
                                }, 3000);
                            }
                        },
                        error: (err: any) => {
                            console.log(err);
                            if (formSubmitException) {
                                console.log(err.error.errors)
                                for (let i of err.error.errors) {
                                    formSubmitException.innerHTML += i.error + '<br>';
                                }
                            }
                        }
                    });
                }
            });
        }
    }
}
