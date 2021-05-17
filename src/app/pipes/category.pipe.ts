import { Pipe, PipeTransform } from '@angular/core';
import { AvailableService } from '../services/available.service';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {


  transform(category: number, args?: any): any {
    if (isNaN(category)) return null; // will only work value is a number
    if (category === null) return null;
    if (category === 0) return null;
    let abs = Math.abs(category);
    const rounder = Math.pow(10, 1);
    const isNegative = category < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
      { key: 'Q', value: Math.pow(10, 15) },
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  }


}
