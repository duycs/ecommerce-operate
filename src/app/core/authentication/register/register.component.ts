import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from, switchMap } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    hide = true;
    success!: boolean;
    error!: any;
    submitted: boolean = false;
    role: string = '';

    constructor(private authService: AuthService,
        private firebaseService: FirebaseService,
        private activatedRoute: ActivatedRoute,
        private translateService: TranslateService,
        private toast: HotToastService,
        private router: Router,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService) {

    }

    ngOnInit() {
        this.initForm();

        this.activatedRoute.queryParams.subscribe(params => {
            this.role = params['role'];
        })
    }

    validate() {
        let isValid = true;
        this.error = "";
        let fullname = this.form.get('fullname')?.value;
        // let firstname = this.form.get('firstname')?.value;
        // let lastname = this.form.get('lastname')?.value;
        let username = this.form.get('username')?.value;
        let password = this.form.get('password')?.value;
        // let address = this.form.get('address')?.value;

        if (!fullname || fullname == "") {
            isValid = false;
            this.error += this.translateService.instant('register.require-fullname');
        }

        // if (!firstname || firstname == "") {
        //     isValid = false;
        //     this.error += this.translateService.instant('register.require-firstname');
        // }

        // if (!lastname || lastname == "") {
        //     isValid = false;
        //     this.error += this.translateService.instant('register.require-lastname');
        // }

        if (!username || username == "") {
            isValid = false;
            this.error += this.translateService.instant('register.require-username');
        }

        // if (!address || address == "") {
        //     isValid = false;
        //     this.error += this.translateService.instant('register.require-address');
        // }

        if (!password || password == "") {
            isValid = false;
            this.error += this.translateService.instant('register.require-valid-password');
        }

        if (!this.role || this.role == "") {
            isValid = false;
            this.error += this.translateService.instant('register.require-role');
        }

        return isValid;
    }

    validateEmail(email: any) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }

    onSubmit() {

        if (!this.validate()) {
            this.success = false;
            return;
        }

        this.spinner.show();

        let username = this.form.get('username')?.value;
        let password = this.form.get('password')?.value;

        let userRegistration = {
            // firstname: this.form.get('firstname')?.value,
            // lastname: this.form.get('lastname')?.value,
            fullname: this.form.get('fullname')?.value,
            username: username,
            password: password,
            // address: this.form.get('address')?.value,
            role: this.role,
        };
        this.authService.register(userRegistration)
            .subscribe(
                (resp) => {
                    this.spinner.hide();
                    this.success = true;
                    this.initForm();
                    let email = username + environment.firebase.defaultSuffixEmail;
                    let firebasePasswordDefault = environment.firebase.defaultPassword;
                    from(this.registerFirebase(email, firebasePasswordDefault, username));
                },
                (error) => {
                    console.log("error", error);
                    this.error = error;
                }
            );
    }

    async registerFirebase(email: string, password: string, name: string) {
        console.log("register firebase", email, password, name);
        let userCredential = await this.firebaseService.signUpWithEmail(email, password);

        console.log("registerFirebase", userCredential);
        //TODO:
        //this.firebaseService.addUser({ userCredential.uid, email, displayName: name })


        // this.toast.observe({
        //     success: 'Congrats! You are all signed up',
        //     loading: 'Signing in',
        //     error: ({ message }) => `${message}`,
        // })
    }

    login() {
        this.router.navigateByUrl('/login');
    }

    initForm() {
        this.form = this.fb.group({
            fullname: [null, Validators.required],
            // firstname: [null, Validators.required],
            // lastname: [null, Validators.required],
            password: [null, Validators.required],
            username: [null, Validators.required],
            // address: [null, Validators.required],
        });
    }
}