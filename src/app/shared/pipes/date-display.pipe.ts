import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'dateDisplay',
})
export class DateDisplayPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {

  }

  transform(dateTime: Date & Timestamp, args?: any): string {
    if (dateTime) {
      let date;

      if (dateTime.seconds) {
        date = new Date(dateTime.seconds * 1000);
      } else {
        date = new Date(dateTime);
      }

      if (!date) return '';

      this.datePipe = new DatePipe(environment.locale);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (args === 'origin') {
        return this.datePipe.transform(date, environment.formatDate) ?? '';
      }

      if (args === 'full') {
        return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
      }

      if (seconds < 29) { // less than 30 seconds ago will show as 'Just now'
        return 'vừa xong';
      } else if (seconds <= 604800) {
        const intervals: { [key: string]: number } = {
          //'year': 31536000,
          //'month': 2592000,
          'week': 604800,
          'day': 86400,
          'hour': 3600,
          'minute': 60,
          'second': 1
        };
        let counter;
        for (const i in intervals) {
          counter = Math.floor(seconds / intervals[i]);

          let name = '';
          if (i === 'week') {
            name = 'tuần';
          } else if (i === 'day') {
            name = 'ngày';
          } else if (i === 'hour') {
            name = 'giờ';
          } else if (i === 'minute') {
            name = 'phút';
          } else if (i === 'second') {
            name = 'giây';
          }

          if (counter > 0)
            if (counter === 1 || counter > 3) {
              return counter + ' ' + name + ' trước'; // 1 ago
            } else {
              return 'vài ' + name + ' trước'; // many ago
            }
        }
      }

      return this.datePipe.transform(date, environment.formatDate) ?? '';
    }

    return '';
  }

}
