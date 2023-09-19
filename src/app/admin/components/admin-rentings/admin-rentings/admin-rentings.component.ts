import {Component, OnInit} from '@angular/core';
import {RentingService} from "../services/rentings/renting.service";
import {HttpHeaders} from "@angular/common/http";
import {TitleService} from "../../../../shared/services/title/title.service";

@Component({
    selector: 'app-admin-rentings',
    templateUrl: './admin-rentings.component.html',
    styleUrls: ['./admin-rentings.component.css']
})
export class AdminRentingsComponent implements OnInit {

    constructor(
        private renitngsService: RentingService,
        private titleService: TitleService
    ) {
    }

    rentingsPaginationData: any = {data: [], pagesCount: 0, currentPage: 0};

    ngOnInit() {
        this.titleService.setPageTitle('Rents');
        this.loadRentingsData(1);
    }

    loadRentingsData(page: number) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.renitngsService.getAll('', '', '', headers, 25, page).subscribe({
            next: (data: any) => {
                this.rentingsPaginationData.data = data;
                this.rentingsPaginationData.pagesCount = Array.from(
                    {length: data.pagesCount},
                    (_, i) => i + 1
                );

                console.log(this.rentingsPaginationData.data)
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
        service.getAll('', '', '', headers, 25, page).subscribe({
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


    goToRentingsPage(page: number) {
        this.goToPage(this.renitngsService, this.rentingsPaginationData, page);
    }

    previousRentingsPage() {
        const currentPage = this.rentingsPaginationData.currentPage;
        if (currentPage > 1) {
            this.goToRentingsPage(currentPage - 1);
        }
    }

    nextRentingsPage() {
        const currentPage = this.rentingsPaginationData.currentPage;
        const totalPages = this.rentingsPaginationData.pagesCount.length;
        if (currentPage < totalPages) {
            this.goToRentingsPage(currentPage + 1);
        }
    }

}
