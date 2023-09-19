import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList, Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { UserRentingsService } from '../../shared/services/userRentingsService/user-rentings.service';
import { DeleteRentingService } from '../../shared/services/deleteRentingService/delete-renting.service';
import { HttpHeaders } from '@angular/common/http';
import {TitleService} from "../../shared/services/title/title.service";
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {JwtHelperService} from "@auth0/angular-jwt";
import {GetUserService} from "../../shared/services/getUserService/get-user.service";
import {PayService} from "./services/payService/pay.service";

@Component({
    selector: 'app-user-rentings',
    templateUrl: './user-rentings.component.html',
    styleUrls: ['./user-rentings.component.css']
})
export class UserRentingsComponent implements OnInit, AfterViewInit {
    userRentings: any[] = [];
    @ViewChild('deleteSuccessModal') deleteSuccessModal!: ElementRef;

    constructor(
        private userRentingsService: UserRentingsService,
        private deleteRentingService: DeleteRentingService,
        private titleService: TitleService,
        private cdr: ChangeDetectorRef,
        private jwtHelper: JwtHelperService,
        private getUserService: GetUserService,
        private payService: PayService
    ) {

    }

    paymentForm!: FormGroup;
    isPaymentModalVisible = false;

    // Properties for payment form
    firstName: string = '';
    lastName: string = '';
    name: string = '';
    cardNumber: string = '';
    expirationDate: string= '';
    securityCode: string= '';

    userId: number = 0;

    ngOnInit() {
        this.titleService.setPageTitle('Rents');

        this.paymentForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z][a-z]* [A-Z][a-z]*$/)]),
            cardNumber: new FormControl('', [Validators.required]),
            expirationDate: new FormControl('', [
                Validators.required,
                Validators.pattern(/^(0[1-9]|1[0-2])\/(2[3-9]|3[0-9]|4[0-9]|5[0-9])$/)
            ]),
            securityCode: new FormControl('', [Validators.required, Validators.pattern(/^(100|[1-9]\d{2,3}|9999)$/)]),
        });


        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.userRentingsService.getAll(undefined, undefined, undefined, headers).subscribe(
            (data: any[]) => {
                this.userRentings = data;
                console.log(data)
            },
            (error: any) => {
                console.error(error);
            }
        );
    }

    markInputDirty() {
        this.paymentForm.get('cardNumber')?.markAsDirty();
    }

    ngAfterViewInit(): void {
        this.loadScripts();
    }

    private loadScript(scriptSrc: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.type = 'text/javascript';
            script.async = true;
            script.onload = () => {
                resolve();
            };
            script.onerror = (error) => {
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    private async loadScripts() {
        try {
            // Load the Imask script
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/imask/3.4.0/imask.min.js');

            // Load the creditCard.js script
            await this.loadScript('../../../assets/templateJS/creditCard.js'); // Adjust the path accordingly

            // Both scripts have loaded, you can now use their functionality

            // @ts-ignore
            window.ucitajCreditCardJs();
        } catch (error) {
            console.error('Error loading script:', error);
        }
    }

    setCardNumberValueAndValidity(value: string) {
        const cardNumberControl = this.paymentForm.get('cardNumber');
        if(cardNumberControl){
            cardNumberControl.setValue(value);
            cardNumberControl.updateValueAndValidity();
        }
    }


    isConfirmationModalVisible: boolean = false; // Flag to control modal visibility
    rentToDeactivate: any;

    // Function to show the confirmation modal and set the user to deactivate
    showDeactivateConfirmationModal(rent: any) {
        this.rentToDeactivate = rent;
        const modalElement = document.getElementById('deactivateConfirmationModal');
        if (modalElement) {
            modalElement.style.display = 'block';
        }
        console.log(rent.id)
    }

// Function to handle deactivation logic when "Deactivate" is clicked in the modal
    confirmDeactivate() {
        // Call your API here to deactivate the user
        // Use this.userToDeactivate to access the user to deactivate
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.deleteRentingService.delete(this.rentToDeactivate.id, headers).subscribe({
            next: (data: any) => {
                console.log("success");
                this.showDeleteSuccessModal();

                this.updateUI();
            },
            error: (err: any) => {
                console.log(err);
            },
        });

        console.log(this.rentToDeactivate.id);
        this.hideConfirmationModal();
    }


// Function to hide the confirmation modal
    hideConfirmationModal() {
        const modalElement = document.getElementById('deactivateConfirmationModal');
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }

    private updateUI() {
        // Trigger change detection to update the UI
        this.cdr.detectChanges();

        // Optionally, you can also reload the data from the server to reflect the changes
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.userRentingsService.getAll(undefined, undefined, undefined, headers).subscribe(
            (data: any[]) => {
                this.userRentings = data;
            },
            (error: any) => {
                console.error(error);
            }
        );
    }

    // Function to show the deleteSuccessModal
    showDeleteSuccessModal() {
        const modalElement = document.getElementById('deleteSuccessModal');
        if (modalElement) {
            modalElement.style.display = 'block';
        }

        // Automatically hide the modal after 2 seconds
        setTimeout(() => {
            this.hideDeleteSuccessModal();
        }, 2000); // 2000 milliseconds (2 seconds)
    }

// Function to hide the deleteSuccessModal
    hideDeleteSuccessModal() {
        const modalElement = document.getElementById('deleteSuccessModal');
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }

    rentToPay: any;
    // Function to show the payment modal
    showPaymentModal(rent: any) {
        // Retrieve first name and last name from local storage

        this.rentToPay = rent;

        const modalElement = document.getElementById('payModal');
        if (modalElement) {
            modalElement.style.display = 'block';
        }

        let sumCost = document.getElementById("sumCost");
        if(sumCost){
            sumCost.innerHTML = rent.sumCost + '€';
        }

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        let decodedToken: any| null = '';


        if(token){
            decodedToken = this.jwtHelper.decodeToken(token);
            console.log(decodedToken);
            if(decodedToken){
                this.userId = decodedToken.UserId;
                console.log(this.userId)
            }
        }


        this.cdr.detectChanges();

        // Show the payment modal
        this.isPaymentModalVisible = true;
    }

    hidePaymentModal() {
        const modalElement = document.getElementById('payModal');
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }

    confirmPayment() {
        // Call your API here to deactivate the user

        if(this.paymentForm.valid){

            this.updateUI();

            let rentId = {
                "id": this.rentToPay.id
            }
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.payService.update(rentId, headers).subscribe({
                next: (data: any) => {
                    console.log("success");
                    //this.showDeleteSuccessModal();

                    this.updateUI();
                },
                error: (err: any) => {
                    console.log(err);
                },
            });
            // console.log(this.rentToDeactivate.id);
            this.hidePaymentModal();
        }
        this.cdr.detectChanges(); // Trigger change detection

    }

}
