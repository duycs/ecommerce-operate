import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { environment } from 'src/environments/environment';
@Pipe({
    name: 'currencyDisplay',
})
export class CurrencyDisplayPipe implements PipeTransform {
    transform(
        value: number,
        currencyCode: string = environment.currency,
        display:
            | 'code'
            | 'symbol'
            | 'symbol-narrow'
            | string
            | boolean = 'symbol',
        digitsInfo: string = '3.2-2',
        locale: string = 'fr',
    ): string | null {
        return formatCurrency(
            value,
            locale,
            getCurrencySymbol(currencyCode, 'wide'),
            currencyCode,
            digitsInfo,
        );
    }
}