import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-edit-staff-password',
    templateUrl: './edit-staff-password.component.html',
    styleUrls: []
})

export class EditStaffPasswordComponent implements OnInit {
    form!: FormGroup;
    staff!: any;
    isLoading = true;
    hide = true;

    constructor(private fb: FormBuilder,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<EditStaffPasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.staff = this.data;
        this.form = this.fb.group({
            curentPassword: ["", Validators.required],
            newPassword: ["", Validators.required],
            reNewPassword: ["", Validators.required],
        });
    };

    pressChangeReNewPassword(event: any) {
        let reNewPassword = event.target.value;
    }

    okClick(): void {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}