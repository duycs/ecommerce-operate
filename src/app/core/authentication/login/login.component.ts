import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: 'login.component.html',
    selector: 'app-login',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    redirect!: string;
    hide = true;
    errorMessage: string = "";
    buildVersion: string = "";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.buildVersion = environment.build;
        this.redirect = this.route.snapshot.queryParams['redirect'];

        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        if (this.authService.isAuthenticated) {
            console.log("redirect", this.redirect);
            this.router.navigateByUrl(this.redirect || '/');
        }
    }

    async onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        let requestLogin = {
            UserName: this.form.get('username')?.value,
            Password: this.form.get('password')?.value
        }

        this.loading = true;

        this.authService.login(requestLogin, this.redirect);
    }
}