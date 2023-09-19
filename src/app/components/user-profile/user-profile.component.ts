import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtHelperService} from '@auth0/angular-jwt';
import {GetUserService} from "../../shared/services/getUserService/get-user.service";
import {UpdateUserService} from "../../shared/services/updateUserService/update-user.service";
import {HttpHeaders} from "@angular/common/http";
import {TitleService} from "../../shared/services/title/title.service";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements AfterViewInit, OnInit {

    updateUserForm!: FormGroup
    userEmail: string = '';
    userId: number = 0;
    firstName: string = '';
    lastName: string = '';
    userName: string = '';
    userAddress: string = '';
    userPhone: string = '';
    image!: File;

    dataToSend: any = {};

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private jwtHelper: JwtHelperService,
        private getUserService: GetUserService,
        private updateUserService: UpdateUserService,
        private titleService: TitleService
    ) {
    }

    ngOnInit(): void {
        this.titleService.setPageTitle('User profile');
        this.updateUserForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            image: new FormControl(null, [Validators.required])
        });

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            this.userEmail = decodedToken.Email;
            this.userId = decodedToken.UserId;

            this.getUserService.get(this.userId, headers).subscribe({
                next: (data: any) => {
                    this.firstName = data.firstName;
                    this.lastName = data.lastName;
                    this.userName = data.userName;
                    this.userAddress = data.address;
                    this.userPhone = data.phone;

                    console.log(data);
                },
                error: (err: any) => {
                    console.log(err);
                }
            });

        } else {

        }
    }

    handleImageInput(event: any) {
        this.image = event.target.files[0];
    }

    submitForm() {
        if (this.updateUserForm.valid) {

            const formData = new FormData();
            formData.append('Image', this.image);
            formData.append('UserId', this.userId.toString());
            formData.append('FirstName', this.firstName);
            formData.append('LastName', this.lastName);
            formData.append('Username', this.userName);
            formData.append('Address', this.userAddress);
            formData.append('Phone', this.userPhone);

            let formSubmitException = document.getElementById("formSubmitException");
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.updateUserService.update(formData, headers).subscribe({
                next: (data: any) => {
                    console.log('Uspenso');
                    if (formSubmitException) {

                        formSubmitException.classList.remove("text-danger");
                        formSubmitException.classList.add("text-white");
                        formSubmitException.innerHTML = "You successfully changed your informations!";
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

        } else {

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
