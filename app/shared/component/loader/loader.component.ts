import { Component, Input } from '@angular/core';

@Component({
  selector: 'wb-loading-spinner',
  template : '<div  fxLayout="row" fxLayoutAlign="center center" *ngIf="loading" > <mat-spinner color="accent" diameter= 50></mat-spinner> </div>'
})
export class loader {
  @Input() loading:boolean
}
