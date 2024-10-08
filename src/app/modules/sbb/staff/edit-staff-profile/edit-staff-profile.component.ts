import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
    selector: 'app-edit-staff-profile',
    templateUrl: './edit-staff-profile.component.html',
    styleUrls: []
})

export class EditStaffProfileComponent implements OnInit {
    form!: FormGroup;
    price!: number;
    upPrice!: number;
    note!: number;
    phoneNumber: string = '';
    staff!: any;
    avatars: any[] = [];

    constructor(private fb: FormBuilder,
        private alertService: AlertService,
        private staffService: StaffService,
        public dialogRef: MatDialogRef<EditStaffProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    };

    ngAfterViewInit(): void {
    };

    ngOnInit(): void {
        this.staff = this.data;
        this.form = this.fb.group({
            name: [this.staff.name, Validators.required],
            phoneNumber: [this.staff.phoneNumber, Validators.required],
            email: [this.staff?.email],
            gender: [this.staff?.gender + ''],
            active: [this.staff?.active + '' ?? 'false'],
            description: [this.staff?.description],
            dob: new FormControl(this.staff?.dob)
        });

        if (this.staff.avatarUrl && this.staff.avatarUrl !== '') this.avatars.push(this.staff?.avatarUrl);

    };

    uploadAvartarImageFinished(event: any) {
        if (event) {
            this.avatars = this.avatars.concat(event);
            this.avatars.forEach((image: any) => {
                image = image + (new Date()).getTime();
            });
        }
    }

    save(): void {
        let data: any = {
            name: this.form.get('name')?.value,
            email: this.form.get('email')?.value,
            phoneNumber: this.form.get('phoneNumber')?.value,
            description: this.form.get('description')?.value,
            gender: this.form.get('gender')?.value,
            active: this.form.get('active')?.value,
            dob: this.form.get('dob')?.value,
            avatarUrl: this.avatars[0],
        };

        
        this.staffService.updateStaff(this.staff.id, data).subscribe(() => {
            this.alertService.showToastMessage(`Cập nhật nhân viên thành công`);
        });

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}