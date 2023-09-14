import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {SingleCarService} from "../services/single-car.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TitleService} from "../../../shared/services/title/title.service";


@Component({
    selector: 'app-singlecar',
    templateUrl: './singlecar.component.html',
    styleUrls: ['./singlecar.component.css']
})
export class SinglecarComponent implements AfterViewInit, OnInit {

    car: any = [];
    carId: number = 0;
    imgUrls: any = [];


    constructor(
        private renderer: Renderer2,
        private singleCarService: SingleCarService,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: TitleService
    ) {
    }

    ngOnInit(): void {

        const apiKey = 'y7ZJohrsKbAX7BfHG4AR3k5clFCknL3cBpz5764zrzsqbpfG6IzAgRVS';
        const query = 'car'; // Your query for car images
        const width = 1000; // Desired width
        const height = 500; // Desired height


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

        this.titleService.setPageTitle('Single car')
        this.route.params.subscribe(params => {
            this.carId = params['id'];
        })
        this.singleCarService.get(this.carId).subscribe({
            next: (data: any) => {
                this.car = data;
                console.log(data);
            },
            error: (err: any) => {
                console.log(err);
                this.router.navigate(['/']);
            }
        })
    }

    rndImage(id: number): string {
        if (this.imgUrls && this.imgUrls.photos && this.imgUrls.photos[id] && this.imgUrls.photos[id].src) {
            return this.imgUrls.photos[id].src.large;
        } else {
            // Handle the case where the properties are not defined or return a default value.
            return '../../../../assets/templateImages/car-1.jpg';
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
