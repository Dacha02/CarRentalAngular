import {Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2, AfterViewInit} from '@angular/core';
import {UserService} from "./services/users/user.service";
import {CarService} from "../../../components/cars/services/cars/car.service";
import {AuditLogService} from "./services/auditLogs/audit-log.service";
import {HttpHeaders} from "@angular/common/http";
import {DeactivateUserService} from "./services/deactivateUsers/deactivate-user.service";
import {ActivateUserService} from "./services/activateUsers/activate-user.service";
import {ProfitsService} from "./services/profits/profits.service";
import {NavigationEnd, Router} from "@angular/router";
import {TitleService} from "../../../shared/services/title/title.service";

// app.component.ts
declare const globalData: any;

interface PaginationData<T> {
    data: T[];
    pagesCount: number;
    currentPage: number;
    // Add other properties as needed, such as totalItems, etc.
}

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css']
})


export class AdminHomeComponent implements OnInit, AfterViewInit {
    constructor(
        public userService: UserService,
        public auditLogService: AuditLogService,
        private cdr: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private deactivateUserService: DeactivateUserService,
        private activateUserService: ActivateUserService,
        private profitsService: ProfitsService,
        private router: Router,
        private titleService: TitleService
    ) {
    }


    usersPaginationData: any = {data: [], pagesCount: 0, currentPage: 0};
    auditLogsPaginationData: any = {data: [], pagesCount: 0, currentPage: 0};

    profitsArray: any = [];

    ngOnInit(): void {
        this.titleService.setPageTitle('Admin home')
        this.loadUsersData(1);
        this.loadAuditLogsData(1);

    }

    ngAfterViewInit(): void {
        // Load the script when the data is fetched and initialized
        this.loadDataAndInitializeChart();
    }

    annualEarning: number = 0;
    monthlyEarning: number = 0;

    loadDataAndInitializeChart(): void {
        this.profitsService.getAll('', '', '', undefined, undefined, undefined).subscribe({
            next: (data: any) => {
                this.profitsArray = data.byMonth;

                this.annualEarning = data.yearly;
                this.monthlyEarning = data.monthly;

                // After data is fetched and assigned, initialize the chart
                //this.initializeChart();

                // Load the chart-area-demo.js script dynamically
                globalData.numbersArray = this.profitsArray;
                this.loadScript('assets/adminJs/chart-area-demo.js');
            },
            error: (err: any) => {
                console.log(err);
            },
        });
    }

    loadScript(scriptUrl: string): void {
        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;
        this.renderer.appendChild(this.elementRef.nativeElement, script);
    }


    loadUsersData(page: number) {
        this.userService.getAll('', '', '', undefined, undefined, page).subscribe({
            next: (data: any) => {
                this.usersPaginationData.data = data;
                this.usersPaginationData.pagesCount = Array.from(
                    {length: data.pagesCount},
                    (_, i) => i + 1
                );

                //console.log(this.usersPaginationData.data)
            },
            error: (err: any) => {
                console.log(err);
            },
        });
    }

    loadAuditLogsData(page: number) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.auditLogService
            .getAll('', '', '', headers)
            .subscribe({
                next: (data: any) => {
                    this.auditLogsPaginationData.data = data;
                    this.auditLogsPaginationData.pagesCount = Array.from(
                        {length: data.pagesCount},
                        (_, i) => i + 1
                    );
                },
                error: (err: any) => {
                    console.log(err);
                },
            });
    }

    goToPage(
        service: any,
        paginationData: { data: any[]; pagesCount: number[]; currentPage: number },
        page: number
    ) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        service.getAll('', '', '', headers, undefined, page).subscribe({
            next: (data: any) => {
                paginationData.data = data;
                paginationData.currentPage = page;
                paginationData.pagesCount = Array.from({length: data.pagesCount}, (_, i) => i + 1);
            },
            error: (err: any) => {
                console.log(err);
            },
        });
    }

    goToUsersPage(page: number) {
        this.goToPage(this.userService, this.usersPaginationData, page);
    }

    goToAuditLogsPage(page: number) {
        this.goToPage(this.auditLogService, this.auditLogsPaginationData, page);
    }

    previousUsersPage() {
        const currentPage = this.usersPaginationData.currentPage;
        if (currentPage > 1) {
            this.goToUsersPage(currentPage - 1);
        }
    }

    previousAuditLogsPage() {
        const currentPage = this.auditLogsPaginationData.currentPage;
        if (currentPage > 1) {
            this.goToAuditLogsPage(currentPage - 1);
        }
    }

    nextUsersPage() {
        const currentPage = this.usersPaginationData.currentPage;
        const totalPages = this.usersPaginationData.pagesCount.length;
        if (currentPage < totalPages) {
            this.goToUsersPage(currentPage + 1);
        }
    }

    nextAuditLogsPage() {
        const currentPage = this.auditLogsPaginationData.currentPage;
        const totalPages = this.auditLogsPaginationData.pagesCount.length;
        if (currentPage < totalPages) {
            this.goToAuditLogsPage(currentPage + 1);
        }
    }

    isConfirmationModalVisible: boolean = false; // Flag to control modal visibility
    userToDeactivate: any;


    // Function to show the confirmation modal and set the user to deactivate
    showDeactivateConfirmationModal(user: any) {
        this.userToDeactivate = user;
        const modalElement = document.getElementById('deactivateConfirmationModal');
        if (modalElement) {
            modalElement.style.display = 'block';
        }
    }

// Function to handle deactivation logic when "Deactivate" is clicked in the modal
    confirmDeactivate() {
        // Call your API here to deactivate the user
        // Use this.userToDeactivate to access the user to deactivate
        this.deactivateUserService.delete(this.userToDeactivate.id).subscribe({
            next: (data: any) => {
                this.updateUI();
            },
            error: (err: any) => {
                console.log(err);
            },
        });

        //console.log(this.userToDeactivate.id);
        this.hideConfirmationModal();
    }

    activateUser(user: number) {
        // Call your API here to deactivate the user
        // Use this.userToDeactivate to access the user to deactivate
        const data = {
            id: user
        }
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.activateUserService.update(data, headers).subscribe({
            next: (data: any) => {
                this.updateUI();
            },
            error: (err: any) => {
                console.log(err);
            },
        });

        //console.log(user);
    }

// Function to hide the confirmation modal
    hideConfirmationModal() {
        const modalElement = document.getElementById('deactivateConfirmationModal');
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }

    // Function to update the UI after deactivation or activation
    private updateUI() {
        // Trigger change detection to update the UI
        this.cdr.detectChanges();

        // Optionally, you can also reload the data from the server to reflect the changes
        this.loadUsersData(this.usersPaginationData.currentPage);
    }


}
