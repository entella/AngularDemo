import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTestCase'
})
export class FilterTestCasePipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }

  transform(items: any[], searchText: string) {
    if (!items || !searchText || searchText == '') {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    //return items.filter(item => item.Value.indexOf(searchText) !== -1);
    return items.filter(item => item.Value.indexOf(searchText) !== -1);
}}
