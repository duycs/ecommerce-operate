import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize } from 'rxjs/operators'
import { UserRegistration } from 'src/app/shared/models/userRegistration';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    form!: FormGroup;
    hide = true;
    success!: boolean;
    error!: any;
    submitted: boolean = false;
    role: string = '';

    constructor(private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private translateService: TranslateService,
        private route: Router,
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
        let currentPassword = this.form.get('currentPassword')?.value;
        let newPassword = this.form.get('newPassword')?.value;

        if (!currentPassword || currentPassword == "") {
            isValid = false;
            this.error += this.translateService.instant('change-password.require-current-password');
        }

        if (!newPassword || newPassword == "") {
            isValid = false;
            this.error += this.translateService.instant('change-password.require-new-password');
        }

        return isValid;
    }

    onSubmit() {
        if (!this.validate()) {
            this.success = false;
            return;
        }

        this.spinner.show();

        let changePasswordForm = {
            currentPassword: this.form.get('currentPassword')?.value,
            newPassword: this.form.get('newPassword')?.value,
        };
        this.userService.changePassword(changePasswordForm)
            .subscribe(
                (resp) => {
                    this.spinner.hide();
                    this.success = true;
                    this.initForm();
                },
                (error) => {
                    console.log("error", error);
                    this.error = error;
                }
            );
    }

    login() {
        this.route.navigateByUrl('/login');
    }

    initForm() {
        this.form = this.fb.group({
            currentPassword: [null, Validators.required],
            newPassword: [null, Validators.required],
        });
    }
}