import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {GetUserService} from "../../../shared/services/getUserService/get-user.service";
import {RegisterService} from "../services/registerService/register.service";
import {TitleService} from "../../../shared/services/title/title.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit, OnInit {

    registerUserForm!: FormGroup
    userEmail: string = '';
    userId: number = 0;
    firstName: string = '';
    lastName: string = '';
    userName: string = '';
    password: string = '';
    userAddress: string = '';
    userPhone: string = '';
    image!: File;

    dataToSend: any = {};

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private jwtHelper: JwtHelperService,
        private getUserService: GetUserService,
        private registerService: RegisterService,
        private titleService: TitleService
    ) {
    }

    ngOnInit(): void {
        this.titleService.setPageTitle('Register');
        this.registerUserForm = new FormGroup({
            firstName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,})?$/)]),
            lastName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z][a-z]{2,}(\s[A-Z][a-z]{2,})?$/)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
            userName: new FormControl('', [Validators.required, Validators.pattern(/^(?=[a-zA-Z0-9._]{3,12}$)(?!.*[_.]{2})[^_.].*[^_.]$/)]),
            address: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required, Validators.pattern(/^06\d{7,10}$/)]),
            image: new FormControl(null, [Validators.required])
        });

    }

    handleImageInput(event: any) {
        this.image = event.target.files[0];
    }

    submitForm() {
        if (this.registerUserForm.valid) {

            this.userEmail = this.registerUserForm.get('email')?.value;
            this.password = this.registerUserForm.get('password')?.value;
            this.firstName = this.registerUserForm.get('firstName')?.value;
            this.lastName = this.registerUserForm.get('lastName')?.value;
            this.userName = this.registerUserForm.get('userName')?.value;
            this.userAddress = this.registerUserForm.get('address')?.value;
            this.userPhone = this.registerUserForm.get('phone')?.value;

            const formData = new FormData();
            formData.append('Image', this.image);
            formData.append('FirstName', this.firstName);
            formData.append('LastName', this.lastName);
            formData.append('Username', this.userName);
            formData.append('Email', this.userEmail);
            formData.append('Password', this.password);
            formData.append('Address', this.userAddress);
            formData.append('Phone', this.userPhone);

            let formSubmitException = document.getElementById("formSubmitException");
            this.registerService.create(formData).subscribe({
                next: (data: any) => {
                    console.log('Uspenso');
                    if (formSubmitException) {

                        formSubmitException.classList.remove("text-danger");
                        formSubmitException.classList.add("text-white");
                        formSubmitException.innerHTML = "You successfully register!";
                        setTimeout(() => {
                            if (formSubmitException) {
                                formSubmitException.classList.remove("text-white");
                                formSubmitException.innerHTML = "";

                            }
                        }, 3000);
                    }
                },
                error: (err: any) => {
                    console.log(err);
                    if (formSubmitException) {
                        formSubmitException.innerHTML = err.error.errors[0].error;
                    }
                }
            });

        }
    }


    ngAfterViewInit(): void {
        setTimeout(() => {
            const script = this.renderer.createElement('script');
            script.src = '../../../../assets/templateJS/main.js';
            this.renderer.appendChild(document.body, script);
        }, 100)
    }
}
