import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class TruncatePipe {
  transform(value: string, args: string) : string {
   
    let trail = '...';
    return value.length > 30 ? value.substring(0, 30) + trail  : value;
  }
}