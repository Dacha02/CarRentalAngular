import {Component, Renderer2, ChangeDetectorRef} from '@angular/core';
import {CarService} from "../../../components/cars/services/cars/car.service";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpHeaders} from "@angular/common/http";
import {DeactivateCarService} from "./services/deactivateCars/deactivate-car.service";
import {TitleService} from "../../../shared/services/title/title.service";

@Component({
    selector: 'app-admin-cars',
    templateUrl: './admin-cars.component.html',
    styleUrls: ['./admin-cars.component.css']
})
export class AdminCarsComponent {
    constructor(
        private renderer: Renderer2,
        private carServices: CarService,
        private deactivateCarService: DeactivateCarService,
        private titleService: TitleService,
        private cdRef: ChangeDetectorRef
    ) {
    }

    cars: any = [];
    pagesCount: any[] = [];
    keyword: string = '';
    filterForm!: FormGroup;
    imgUrls: any = [];

    ngOnInit(): void {

        this.titleService.setPageTitle('Cars');
        this.filterForm = new FormGroup({
            keyword: new FormControl(),
            perPage: new FormControl('15')
        });

        this.carServices.getAll().subscribe({
            next: (data: any) => {
                this.cars = data;
                this.pagesCount = Array.from({length: this.cars.pagesCount}, (_, i) => i + 1);
                //console.log(this.cars);
            },
            error: (err: any) => {
                console.log(err);
            }
        });

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

    goToPage(page: number) {
        const keyword = this.keyword;
        // const pickUpDate = this.filterForm.get('pickUpDate')?.value;
        // const dropOffDate = this.filterForm.get('dropOffDate')?.value;
        const perPage = this.filterForm.get('perPage')?.value;

        this.carServices.getAll(keyword, '', '', undefined, perPage, page).subscribe({
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

    isConfirmationModalVisible: boolean = false; // Flag to control modal visibility
    carToDeactivate: any;

    // Function to show the confirmation modal and set the user to deactivate
    showDeactivateConfirmationModal(car: any) {
        this.carToDeactivate = car;
        const modalElement = document.getElementById('deactivateConfirmationModal');
        if (modalElement) {
            modalElement.style.display = 'block';
        }
    }

// Function to handle deactivation logic when "Deactivate" is clicked in the modal
    confirmDeactivate() {
        // Call your API here to deactivate the user
        // Use this.userToDeactivate to access the user to deactivate
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.deactivateCarService.delete(this.carToDeactivate.carId, headers).subscribe({
            next: (data: any) => {
                //this.updateUI();
                console.log("success")
            },
            error: (err: any) => {
                console.log(err);
            },
        });

        console.log(this.carToDeactivate.carId);
        this.hideConfirmationModal();
    }


// Function to hide the confirmation modal
    hideConfirmationModal() {
        const modalElement = document.getElementById('deactivateConfirmationModal');
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }

    submitForm() {
        if (this.filterForm.valid) {
            const keyword = this.keyword;
            const perPage = this.filterForm.get('perPage')?.value;

            this.carServices.getAll(keyword, '', '', undefined, perPage).subscribe({
                next: (data: any) => {
                    this.cars = data;
                    this.pagesCount = Array.from({length: this.cars.pagesCount}, (_, i) => i + 1);
                    console.log(data);
                },
                error: (err: any) => {
                    console.log(err);
                }
            });
        } else {

        }
    }
}
