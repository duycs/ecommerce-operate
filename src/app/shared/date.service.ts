import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class DateService {

    constructor(private datePipe: DatePipe) { }

    getDateNow(){
        this.datePipe = new DatePipe(environment.locale);
        return this.datePipe.transform(new Date(), environment.formatDate) ?? '';
    }

    getQueryCreatedDates(queryParams: any, createdDate: string) {
        let dates = createdDate.split("-");
        queryParams.createdDateFrom = this.toDate(dates[0].trim());
        queryParams.createdDateTo = this.toDate(dates[1].trim());

        return queryParams;
    }

    getQueryLastUpdatedDates(queryParams: any, lastUpdatedDate: string) {
        let dates = lastUpdatedDate.split("-");
        queryParams.lastUpdatedDateFrom = this.toDate(dates[0].trim());
        queryParams.lastUpdatedDateTo = this.toDate(dates[1].trim());

        return queryParams;
    }
    

    getQueryDates(queryParams: any, date: string) {
        let dates = date.split("-");
        queryParams.dateFrom = this.toDate(dates[0].trim());
        queryParams.dateTo = this.toDate(dates[1].trim());

        return queryParams;
    }

    toDate(dateStr: any) {
        const [day, month, year] = dateStr.split('/');
        let date = new Date(+year, +month - 1, +day);
        return this.toISOStringWithTimezone(date);
    }

    toISOStringWithTimezone(date: Date) {
        const tzOffset = -date.getTimezoneOffset();
        const diff = tzOffset >= 0 ? '+' : '-';
        function pad(n: any) {
            return `${Math.floor(Math.abs(n))}`.padStart(2, '0');
        }
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            diff + pad(tzOffset / 60) +
            ':' + pad(tzOffset % 60);
    };

}