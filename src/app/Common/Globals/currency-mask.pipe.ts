import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyMask'
})
export class CurrencyMaskPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let amount = String(value);

    const beforePoint = amount.split('.')[0];
    let integers = '';
    if (typeof beforePoint !== 'undefined') {
      integers = beforePoint.replace(/\D+/g, '');
    }
    const afterPoint = amount.split('.')[1];
    let decimals = '';
    if (typeof afterPoint !== 'undefined') {
      decimals = afterPoint.replace(/\D+/g, '');
    }
    if (decimals.length > 2) {
      decimals = decimals.slice(0, 2);
    }
    amount = integers;
    if (typeof afterPoint === 'string') {
      amount += '.';
    }
    if (decimals.length > 0) {
      amount += decimals;
    }

    return amount;
  }

}
