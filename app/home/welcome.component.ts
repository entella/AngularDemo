import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from '../automation-step/common-data.service';
import { AutomationService } from '../automation-step/automation.service';
//import { UserInfo } from '../model/user-info';
import { KeyValueModel } from '../model/common';
import { MatSnackBar } from '@angular/material';

@Component({ 
  templateUrl: './welcome.component.html', 
})
export class WelcomeComponent implements OnInit {

  pageTitle:string = "Welcome to the Alegeus Test Automation Portal, ";
  subTitle:string = "What would you like to do?";
  SelectedType : number = 1;
  //userInfo : UserInfo;
  automationTasks : any;
  showLoader: boolean = false;
  selectedValue: string;
  constructor( private router: Router, public _commonDataService : CommonDataService,private automationService : AutomationService,public snackBar: MatSnackBar) { }

  ngOnInit() {
    this._commonDataService._pageHeader = "Alegeus Test Automation Portal";
   // this.GetAutomationTasks();
    this.getUserIdentity();
    this.pageTitle += this._commonDataService._userInfo.userName;
  }

  continue() : void{
    if (this.SelectedType == 1)
      this.router.navigateByUrl('Schedule');    
    else if (this.SelectedType == 2)
      this.router.navigateByUrl('Dashboard');
    else
      this.router.navigateByUrl('OATCompletedTestResult');
   
  }

  getUserIdentity() : void{  

    if (!this._commonDataService._userInfo.isAuthorized) {
    this.showLoader = true;
    this.automationService.getData('TestUser/GetUserIdentity' )
    .subscribe( data=> {
          this.showLoader = false;
          if (data){      
          this._commonDataService._userInfo = data;
          this.pageTitle += this._commonDataService._userInfo.userName;}

          if (!this._commonDataService._userInfo.isAuthorized)
          { this.snackBar.open("Unuthorized Login !", 'Error', {
              duration: 5000,
            });
          }else 
          {
            this.setUserPermission();
            this.getAutomationTasks();
          }
          console.log(JSON.stringify(data));
    })    
  }else
  {
      this.getAutomationTasks()
  }
}

  getAutomationTasks(): void{ 

    if (this._commonDataService._userInfo.canScheduleTests)
    {
        this.automationTasks = [
          {id : 1,Task:'Schedule New Test'},
          {id :2,Task:'View Currently Running Test Results'},
          {id :3,Task:'View Recently Completed Test Results'}
        ]
        this.SelectedType = 1;
      }
    else
    {
          this.automationTasks = [      
            {id :2,Task:'View Currently Running Test Results'},
            {id :3,Task:'View Recently Completed Test Results'}
          ]
          this.SelectedType = 2;
        }
    }

  setUserPermission(): void{
          //Set user acccess based on role         
          //If UserRoleID is 1 (AutomationUser) there are no restrictions
          if  (this._commonDataService._userInfo.roleId == 1) 
          {
            this._commonDataService._userInfo.canScheduleTests = true;
            this._commonDataService._userInfo.canViewResult = true;
            this._commonDataService._userInfo.IsDebugRunOnly = true;
            this._commonDataService._userInfo.canAbortTest = true;

          //If UserRoleID is 2 (TestCreator), the user is able to schedule tests and review results.  The user will not be allowed to choose “Debug run only”
          }else if (this._commonDataService._userInfo.roleId == 2)
          {
            this._commonDataService._userInfo.canScheduleTests = true;
            this._commonDataService._userInfo.canViewResult = true;
            this._commonDataService._userInfo.IsDebugRunOnly = false;
            this._commonDataService._userInfo.canAbortTest = true;
          }
          //UserName is not found , allow to review results page only
          else
          {
            this._commonDataService._userInfo.canScheduleTests = false;
            this._commonDataService._userInfo.canViewResult = true;
            this._commonDataService._userInfo.IsDebugRunOnly = false;
            this._commonDataService._userInfo.canAbortTest = false;
          }
  }
  
}
