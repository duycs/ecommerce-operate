import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../config.service';

@Component({
    selector: 'app-card-photo-grid',
    templateUrl: './card-photo-grid.component.html',
    styleUrls: ['./card-photo-grid.component.css']
})

export class CardPhotoGridComponent implements OnInit {
    @Input() page: number = 1;
    @Input() title: string = '';
    @Input() photos!: any[];
    @Input() displayDownload: boolean = true;

    length = 50;
    pageSize = 10;
    pageIndex = 1;
    pageSizeOptions = [5, 10, 15, 20];
    pageEvent!: PageEvent;
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    constructor(private router: Router,
        private configService: ConfigService,
        private photoService: PhotoService) {

    };

    ngOnInit(): void {
    }

    handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
    }


    remove(element: string) {
        this.photos.forEach((value, index) => {
            if (value == element) this.photos.splice(index, 1);
        });
    }

}