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

    constructor(
        private renderer: Renderer2,
        private singleCarService: SingleCarService,
        private route: ActivatedRoute,
        private router: Router,
        private titleService: TitleService
    ) {
    }

    ngOnInit(): void {
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

    ngAfterViewInit(): void {
        setTimeout(() => {
            const script = this.renderer.createElement('script');
            script.src = '../../../../assets/templateJS/main.js';
            this.renderer.appendChild(document.body, script);
        }, 1000)
    }

}
