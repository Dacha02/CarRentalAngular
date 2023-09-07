import {Component, AfterViewInit, Renderer2} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {GetUserService} from "../../../shared/services/getUserService/get-user.service";


@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements AfterViewInit {
    constructor(
        private renderer: Renderer2,
        private jwtHelper: JwtHelperService,
        private getUserService: GetUserService
    ) {
    }

    // Your component properties and methods
    userName: string = '';
    userId: number = 0;


    ngOnInit(): void {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            this.userId = decodedToken.UserId;

            this.getUserService.get(this.userId).subscribe({
                next: (data: any) => {
                    this.userName = data.userName;
                    console.log(data);
                },
                error: (err: any) => {
                    console.log(err);
                }
            });

        } else {

        }
    }

    ngAfterViewInit(): void {
        // Load the external JavaScript file
        this.loadScript('../../../../assets/adminJs/sb-admin-2.js');
        // this.loadStyles('../../../../assets/adminCss/sb-admin-2.css');
    }

    private loadScript(url: string): void {
        const script = this.renderer.createElement('script');
        script.src = url;
        script.onload = () => {
            // Script loaded successfully
        };
        script.onerror = () => {
            // Script failed to load
        };
        this.renderer.appendChild(document.head, script);
    }

    // private loadStyles(url: string): void {
    //     const link = this.renderer.createElement('link');
    //     link.rel = 'stylesheet';
    //     link.href = url;
    //     link.onload = () => {
    //         // Stylesheet loaded successfully
    //     };
    //     link.onerror = () => {
    //         // Stylesheet failed to load
    //     };
    //     this.renderer.appendChild(document.head, link);
    // }
}
