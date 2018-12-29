import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonDataService } from '../../../automation-step/common-data.service';

//import { EventEmitter } from 'events';


@Component({
  selector: 'app-toolbr',
  templateUrl: './toolbr.component.html',
  styleUrls: ['./toolbr.component.scss']
})
export class ToolbrComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();
  
  
  _pageHeader : string = '';

  constructor( public _commonDataService : CommonDataService ) { }

  
  ngOnInit() {
    //this._commonDataService._pageHeader = "abc";
    // this._commonDataService._pageHeader.subscribe((str) => {
    //   this._pageHeader = str;
    // });;
  } 

}
