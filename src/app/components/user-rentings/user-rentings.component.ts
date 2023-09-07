import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { UserRentingsService } from '../../shared/services/userRentingsService/user-rentings.service';
import { DeleteRentingService } from '../../shared/services/deleteRentingService/delete-renting.service';
import { HttpHeaders } from '@angular/common/http';
import {TitleService} from "../../shared/services/title/title.service";

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

    ) { }

    ngOnInit() {
        this.titleService.setPageTitle('Rents')
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

    ngAfterViewInit(): void {
        // After the view has been initialized, the deleteSuccessModal element will be available
        //this.hideModal();
    }

    // deleteRenting(rentingId: number) {
    //     // Delete the renting with the specified ID
    //     this.deleteRentingService.delete(rentingId).subscribe(
    //         () => {
    //             // Remove the deleted renting from the userRentings array
    //             this.userRentings = this.userRentings.filter(renting => renting.id !== rentingId);
    //             this.showModal();
    //
    //             setTimeout(() => {
    //                 this.hideModal();
    //             }, 3000);
    //         },
    //         (error: any) => {
    //             console.error(error);
    //         }
    //     );
    // }

    // showModal(): void {
    //     const modalElement = this.deleteSuccessModal.nativeElement;
    //     modalElement.classList.add('show');
    //     modalElement.style.display = 'block';
    // }
    //
    // hideModal(): void {
    //     const modalElement = this.deleteSuccessModal.nativeElement;
    //     modalElement.classList.remove('show');
    //     modalElement.style.display = 'none';
    // }

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


        this.deleteRentingService.delete(this.rentToDeactivate.id).subscribe({
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

}
