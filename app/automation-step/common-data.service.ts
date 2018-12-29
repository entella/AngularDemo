import { Injectable } from '@angular/core';
import { SubmitTestModel } from '../model/submit-test';
import { UserInfo } from '../model/user-info';


@Injectable()
export class CommonDataService {  
  _submitTestCase : SubmitTestModel = new SubmitTestModel() 
  _userInfo : UserInfo = new UserInfo() 
  _pageHeader : any = '';
  _ActiveParentResultPage : number = 1;
  
  ColorEnum : any = {
    Failed:  '#E40541', //'#f44336',
    Passed : '#20A482',//'#57E964',
    TimedOut :'#FF2400',
    Aborted: '#F47B19',//'#FDD017',
    Running:'#3EBEDE',//'#CCFB5D',
    NotYetRun : '#B3B6B7'
  }
  constructor() {
   
   }

   getColor(statusId : any) : string{
    if (statusId == 0)
        return this.ColorEnum.Failed;
    else if (statusId == 1)
        return  this.ColorEnum.Passed;
    else if (statusId == 3)
        return  this.ColorEnum.TimedOut
    else if (statusId == 4)
        return  this.ColorEnum.Aborted
    else if (statusId == 5)
        return  this.ColorEnum.Running;
      else 
        return this.ColorEnum.NotStarted;
  }

}
