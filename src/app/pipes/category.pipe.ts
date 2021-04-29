import { Pipe, PipeTransform } from '@angular/core';
import { AvailableService } from '../services/available.service';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {


  transform(category: number): any {

  }



}
