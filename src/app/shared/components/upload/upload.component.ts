import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
    progress!: number;
    message!: string;
    @Input() buttonName: string = "Upload files";
    @Input() session: string = "";
    @Input() limit: number = 15; // limit per upload 
    @Input() limitTotal: number = 0;
    @Input() limitSizeInMb: number = 10;
    @Input() uploadType: number = 0;

    @Output() public onUploadFinished = new EventEmitter();

    constructor(private http: HttpClient,
        private photoService: PhotoService,
        private alertService: AlertService) { }

    ngOnInit() {
    }

    uploadFiles = (files: any) => {
        if (files.length === 0) {
            return;
        }

        if (!this.uploadType || this.uploadType === 0) {
            this.message = "Chưa cấu hình kiểu upload file";
            this.alertService.showToastMessage(this.message);
        }

        // validate limit files
        if (files.length > this.limit) {
            this.message = `Giới hạn tải lên ${this.limit} ảnh`;
            this.alertService.showToastMessage(this.message);
            return;
        }

        console.log("total", this.limit, this.limitTotal);

        if (this.limitTotal > 0 && this.limitTotal >= this.limit) {
            this.message = `Giới hạn tổng số tải lên ${this.limit} ảnh`;
            this.alertService.showToastMessage(this.message);

            return;
        }

        const fileList = new Array<File>();
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append(files.item(i).name + (new Date().getTime()), files.item(i));
            fileList.push(files.item(i));
        }

        this.progress = 10;
        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = { reportProgress: true, observe: 'events', headers: headers };

        this.photoService.uploadPhoto(formData, options)
            .subscribe({
                next: (event: any) => {
                    console.log("upload photos:", event);

                    if (event && event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total);
                    }
                    else if (event.type === HttpEventType.Response) {
                        this.alertService.showToastSuccess();
                        this.onUploadFinished.emit(event.body);
                        this.message = "";
                    }
                },
                error: (err: HttpErrorResponse) => {
                    console.log(err);
                    this.message = "upload error";
                }
            });

        // Array.from(files).forEach((file: any, index: any) => {

        //     // validate input size
        //     if (this.fileSizeInMb(file) > this.limitSizeInMb) {
        //         this.alertService.showToastMessage(`File ${file.name} vượt quá giới hạn ${this.limitSizeInMb} Mb`);
        //     } else {
        //         this.uploadFile(index, file);
        //     }
        // });
    }

    uploadFile = (index: any, file: File) => {
        console.log(index, file);

        this.progress = 10;
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('session', this.session);
        formData.append('uploadType', this.uploadType.toString());

        let options = { reportProgress: true, observe: 'events' };

        this.photoService.uploadPhoto(formData, options)
            .subscribe({
                next: (event: any) => {
                    console.log("upload photos:", event);

                    if (event && event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total);
                    }
                    else if (event.type === HttpEventType.Response) {
                        this.alertService.showToastSuccess();
                        this.onUploadFinished.emit(event.body);
                        this.message = "";
                    }
                },
                error: (err: HttpErrorResponse) => {
                    console.log(err);
                    this.message = "upload error";
                }
            });
    }

    private fileSizeInMb(file: File) {
        return file.size / (1024 * 1024);
    }
}