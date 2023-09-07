import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../shared/services/loginService/login.service";
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TitleService} from "../../shared/services/title/title.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnInit {

    loginForm!: FormGroup;
    dataToSend: any = {};

    constructor(
        private renderer: Renderer2,
        private loginService: LoginService,
        private router: Router,
        private jwtHelper: JwtHelperService,
        private title: TitleService
    ) {
    }

    ngOnInit(): void {
        this.title.setPageTitle('Login');
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            ])
        });
    }

    submitForm() {
        if (this.loginForm.valid) {
            const email = this.loginForm.get('email')?.value;
            const password = this.loginForm.get('password')?.value;

            this.dataToSend = {
                Email: email,
                Password: password
            }

            let formSubmitException = document.getElementById("formSubmitException");

            this.loginService.create(this.dataToSend, undefined).subscribe({
                next: (data: any) => {
                    //console.log(data.token);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('refreshToken', data.refresh);
                    this.loginForm.reset();
                    const decodedToken = this.jwtHelper.decodeToken(data.token);
                    const usecasesArray = decodedToken.UseCases;
                    console.log(usecasesArray)
                    this.navigateBasedOnArray(usecasesArray);
                    if (formSubmitException) {
                      formSubmitException.classList.remove("text-danger");
                      formSubmitException.classList.add("text-white");
                      formSubmitException.innerHTML = "You successfully logged in!";
                    }
                },
                error: (err: any) => {
                    //console.log(err);
                    if (formSubmitException) {
                      formSubmitException.innerHTML = 'Email or password is incorrect';
                    }
                }
            });
        } else {

        }
    }

    navigateBasedOnArray(array: number[]) {
        if (array.includes(9)) {
            this.router.navigate(['/admin/home']);
        } else {
            this.router.navigate(['/']);
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
