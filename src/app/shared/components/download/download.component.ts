import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
    message!: string;
    progress!: number;

    @Input() fileUrl!: string;

    constructor(private photoService: PhotoService) { }

    ngOnInit(): void { }

    download = () => {
        let fileUrls = [this.fileUrl];
        console.log("fileUrls", fileUrls);
        this.photoService.downloadPhotos(fileUrls).subscribe((data: any) => {
            this.downloadFile(data);
        });
    }

    getFileName(fileUrl: any){
        let strings = fileUrl.split('\\') ?? "";
        return strings[strings.length - 1].split('?')[0] ?? "";
    }

    private downloadFile = (data: any) => {
        if (!data || data == null) return;

        const downloadedFile = new Blob([data], { type: data.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = this.getFileName(this.fileUrl);
        a.href = URL.createObjectURL(downloadedFile);
        a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }
}