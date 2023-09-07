import {Component, OnInit} from '@angular/core';
import {AfterViewInit, Renderer2} from '@angular/core';
import {TitleService} from "../../../shared/services/title/title.service";


@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit, OnInit {

    constructor(
        private renderer: Renderer2,
        private titleService: TitleService
    ) {

    }

    ngOnInit(): void {
        this.titleService.setPageTitle('Contact')
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            const script = this.renderer.createElement('script');
            script.src = '../../../../assets/templateJS/main.js';
            this.renderer.appendChild(document.body, script);
        }, 100)
    }
}
