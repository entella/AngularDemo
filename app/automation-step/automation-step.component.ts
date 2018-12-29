import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder,Validators, AbstractControl} from '@angular/forms';
import { KeyValueModel } from '../model/common';
import { AutomationService } from './automation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonDataService } from './common-data.service';
import { testEnvironment } from '../model/test-environment';
import { TestApplicationModel } from '../model/test-application';
import { TestSuiteModel } from '../model/test-suite-model';
import { TestCaseModel } from '../model/test-case-model';
import { TestBrowserOperatingSystem } from '../model/test-browser-operating-system';
import { ScheduleAutomationModel } from '../model/ScheduleAutomation-Model';
import { MatStepper } from '@angular/material/stepper';
import { FunctionalAreaMajorModel } from '../model/functional-area-major-model';
import { FunctionalAreaModel } from '../model/functional-area-model';
import { MatSelectionList, MatDialog } from '@angular/material';
import { MatDialogComponent } from '../shared/component/dialog/mat-dialog.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { timeInterval } from 'rxjs/operator/timeInterval';

@Component({
  selector: 'app-automation-step',
  templateUrl: './automation-step.component.html',
  styleUrls: ['./automation-step.component.scss']
})
export class AutomationStepComponent implements OnInit {

  //#region  Declare Local variable

  StepOne: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  resultFormGroup: FormGroup;
  submittedId : number = 0;
  _isEditable = true;
  showLoader:boolean=false;

  isTestCase : number = 1;
  usesBrowserCount : number = 0;
  randomNumber : number = 0;
  //#endregion 

  //Contractor to pass service dependency 
  constructor( private _formBuilder: FormBuilder ,private automationService:AutomationService, 
    private router: Router, public _commonDataService : CommonDataService,private dialog: MatDialog,private activatedRoute: ActivatedRoute) { }
 
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('lstTestCase') lstTestCase :MatSelectionList;
    @ViewChild('lstBrowserOperatingSystem') lstBrowserOperatingSystem : MatSelectionList;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {     
      this.randomNumber = +params['id'] || 0;  
    });
    this.fromBuilderModel(); 
    this.getEnviornmentList();
    this.getScheduleRunType(); 
  }


  //#region declare from Builder Model

 fromBuilderModel():void{ 

        this.StepOne = this._formBuilder.group({
          selectedEnvironmentId: ['', Validators.required],
          selectedscheduleRunType : [1, Validators.required],
          description :[''],
          isDebugRun :[this._commonDataService._userInfo.IsDebugRunOnly],
          showDebugRun : [this._commonDataService._userInfo.IsDebugRunOnly]
        });


        this.secondFormGroup = this._formBuilder.group({          
          selectedTestSuits: [this.selectedTestSuits],
          selectedFeatures : [this.selectedFeatures],
          selectedTestCases : [this.selectedTestCases ,Validators.required],
          searchText : ['']
        });
      

        this.thirdFormGroup = this._formBuilder.group({      
          selectedbrowserSystemList : [this.selectedbrowserSystemList ,Validators.required],
        });

        this.fourthFormGroup = this._formBuilder.group({
         // reserveDay: [null],
          isScheduled: ['', Validators.required]
        });
  }

  //#endregion


 //#region : step one - Select Task
  public pageTitle:string = "Welcome, RReuter!";  
  environmentList:  testEnvironment[];
  scheduleRunTypeList:  KeyValueModel[];

  selectedscheduleRunType: number;
  selectedEnvironmentId : number;
  description : string;
  isDebugOnly : boolean = false;
  selctedApplication : string;

  getEnviornmentList():void{
   this.automationService.getData('TestEnvironment' )
   .subscribe( data=> {
     if (data)
    this.environmentList = data.list;
   }) 
  }

  getScheduleRunType() : void{
    var obj  = new KeyValueModel()
    obj.key =1;
    obj.Value = "A Test Suite / Test Suites"
    obj.isSelected = true;

    var obj1  = new KeyValueModel()
    obj1.key =2;
    obj1.Value = "Tests related to a particular feature / functional area"

    var obj2  = new KeyValueModel()
    obj2.key =3;
    obj2.Value = "A variety of test cases"
    this.scheduleRunTypeList = [obj,obj1,obj2];
  }  

  runTypeChange(){
    this.resetData(1);
  }
  //#endregion


  //#region: Step Two - Select Test case / Feature
  
  errorMessage : string = '';
  applicationModel : TestApplicationModel[]=[];
  functionalAreaMajorModel : FunctionalAreaMajorModel[]=[];

  functionalAreaModel : FunctionalAreaModel[]=[];

  testSuits:TestSuiteModel[]=[];
  selectedTestSuits:TestSuiteModel[]=[];
  selectedFeatures:FunctionalAreaModel[]=[];

  testCases:TestCaseModel[]=[];
  selectedTestCases:TestCaseModel[]=[];

  appSelectedOptions : string[] = [];
  appSelectedOptionsOld : string = '';
  applicationId : number = null;
  filter : KeyValueModel = new KeyValueModel();
  
  filterargs = {Value: '3'};
  appId : string;
  panelOpenState: boolean = true;

  getApplicationList() : void{  
    this.automationService.getData('TestApplication' )
    .subscribe( data=> {
      if (data)
     this.applicationModel = data.list;
    })    
  }

  getFunctionalAreaMajorList() : void{  
    this.functionalAreaMajorModel =[];
    this.automationService.getData('FunctionalAreaMajor' )
    .subscribe( data=> {
      if (data)
     this.functionalAreaMajorModel = data.list;
    })    
  }

  getTestSuits(obj) : void {
    this.panelOpenState = !this.panelOpenState;

    this.testSuits = [];
    this.testCases = [];
    this.selctedApplication = "  |  " + obj.TestApplicationName;
    this.automationService.getDataById('TestSuite/TestSuiteByApplicationId',obj.TestApplicationID )
    .subscribe( data=> {
      if (data)
     this.testSuits = data;
    })
  }

  getTestcase(testSuiteID,event) : void {  
  
    if (event.selected){   
      //this.showLoader = true;   
          this.automationService.getDataById('TestCase/TestCaseTestSuiteId',testSuiteID )
            .subscribe( data=> {
              //this.showLoader = false;
              if (data)
              data.forEach(item  => {
                this.testCases.push(item);
            })
        })
    }
    else {
            this.testCases = this.filterTestCashes(testSuiteID,0)
         }
  }

  getAllTestCases(){
    this.testCases = [];
    this.showLoader = true; 
    this.automationService.getData('TestCase' )
    .subscribe( data=> {
      this.showLoader = false; 
      if (data)
      data.list.forEach(item  => {
        this.testCases.push(item);
    })
    });
  }


  getFeturesByFunctionalAreaMajorId(obj){
    this.panelOpenState = !this.panelOpenState;
    this.functionalAreaModel = [];
    this.selctedApplication = "  |  " + obj.FunctionalAreaMajorName;
    this.automationService.getDataById('FunctionalArea/GetFunctionAreaByFunctionAreaMajorId',obj.FunctionalAreaMajorID)
    .subscribe( data=> {
      if (data)
      data.forEach(item  => {
        this.functionalAreaModel.push(item);
    })
  })
  }

  getTestCaseByFunctionalAreaId(functionalAreaId,event) : void {  
    if (event.selected && functionalAreaId >0){ 
      
      if (this.testCases == undefined)
          this.testCases  = [];

          this.automationService.getDataById('TestCase/GetTestCaseByFunctionalAreaId',functionalAreaId )
            .subscribe( data=> {
              if (data)
              data.forEach(item  => {
                this.testCases.push(item);
            })
        })
    }
    else {
            this.testCases = this.filterTestCashes(0,functionalAreaId)
         }
  }


  filterTestCashes(testSuiteID:number, functionalAreaId:number){  
    if (testSuiteID > 0)
     return this.testCases.filter( x=>x.TestSuiteId != testSuiteID)   
    else if (functionalAreaId > 0)
      return this.testCases.filter( x=>x.FunctionalAreaId != functionalAreaId)   

  }

  GetScheduleScreenName(stepNumber) : string {
    if (stepNumber == 1 ){
      if ( this.StepOne.value.selectedscheduleRunType == 1 )
        return 'Select Test Suites';
      else if ( this.StepOne.value.selectedscheduleRunType == 2 )
       return 'Select Features';
      else
        return 'Select Variety of Test case';
    }
  }

  selectAll(event):void{
    if (event.checked)
    this.lstTestCase.selectAll();
    else
    this.lstTestCase.deselectAll();
  }

  openDialog(description) : void{
    let dialogRef = this.dialog.open(MatDialogComponent, { 
      height:'40vw',
      width:'60vw', 
      data: {
        testDescription: description,
        id : "step2"        
      }
    });
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
}

  
  //#endregion
  

  //#region : Step Three - Select Browser | operting system

    browserSystemList:TestBrowserOperatingSystem[]=[];
    selectedbrowserSystemList : TestBrowserOperatingSystem[]=[];;
    showBrowserOperatingsySys : boolean = false;

    getBrowserSystemList() : void{  
     //Load browser operating system
     this.automationService.getData('TestBrowser/BrowserOperatingSystem' )
     .subscribe( data=> {
       if (data)
       data.forEach(item  => {
         this.browserSystemList.push(item);
     })
    });
    }    

    selectAllBrowser(event):void{
      if (event.checked)
      this.lstBrowserOperatingSystem.selectAll();
      else
      this.lstBrowserOperatingSystem.deselectAll();
    }
//#endregion


  //#region : Step Four - Scheduling Test/Feautre
  ScheduleTest() : void {

   if (this.secondFormGroup.value.selectedTestCases.length > 0) 
   {
      var ObjModel = new ScheduleAutomationModel();
      ObjModel.testEnvironmentId = this.StepOne.value.selectedEnvironmentId;
      ObjModel.testDescription = this.StepOne.value.description; // Need to change
      ObjModel.testRequestedBy = this._commonDataService._userInfo.userName ; // "rreuter@alegeus.com" // Need to change
      ObjModel.submittedTestTimeOut = 20 // Need to change
      ObjModel.isDebugRun = this.StepOne.value.isDebugRun;

      ObjModel.OperatingSystemTestBrowserPairs = this.showBrowserOperatingsySys ? this.thirdFormGroup.value.selectedbrowserSystemList : null;
      ObjModel.testCases = this.secondFormGroup.value.selectedTestCases;
      this.showLoader = true;

      this.automationService.postData(ObjModel,'SubmittedTest')
      .subscribe( data=> {
          if (data > 0){
          this.submittedId = data;         
          this.fourthFormGroup.controls.isScheduled.setValue('true');          
          this.stepper.selectedIndex =  (this.stepper.selectedIndex + 1);  
          this._isEditable = false;
      }
        else {
        }
          this.showLoader = false;
    })  
   

   }
  }
  //#endregion


  //#region : Step Five  - Schedule Result
  home() : void{    
    this._isEditable = true; 
    this.router.navigateByUrl('welcome');
  }


  scheduleNew() : void{ 
   //redirect to schedule test page again, to reload same route again route should be different.
   if (this.randomNumber >0)
      this.router.navigateByUrl('Schedule');
   else
      this.router.navigateByUrl('/Schedule/'+ 1);
  
}

//#endregion


 //#region  Common Methods 

 NextClick(step){
 
  if (step == 1 ){
        //If What would you like to run == A variety of test cases
        if (this.StepOne.value.selectedscheduleRunType == 3 && this.secondFormGroup.value.selectedTestCases && this.secondFormGroup.value.selectedTestCases.length==0){
            //Load all test cases 
            this.getAllTestCases()
      }
    else if (this.StepOne.value.selectedscheduleRunType == 2){
            this.getFunctionalAreaMajorList();
      }else {
            this.getApplicationList();
      }
  }
  else if (step == 2 ){
    
    this.usesBrowserCount = this.secondFormGroup.value.selectedTestCases.filter(x =>x.UsesBrowser == true).length;

    if (this.secondFormGroup.value.selectedTestCases.length >0 && 
      this.usesBrowserCount > 0 && this.browserSystemList.length==0)
      {
        this.getBrowserSystemList();
        
      }
      
      //Hide Browser operating system selection if UsesBrowser=0 for all selected test case
      if (this.usesBrowserCount> 0){
        this.showBrowserOperatingsySys = true;
        this.thirdFormGroup.get('selectedbrowserSystemList').setValidators([Validators.required]);
        this.thirdFormGroup.get('selectedbrowserSystemList').updateValueAndValidity();
      
      }
      else{
        this.showBrowserOperatingsySys = false;
        this.thirdFormGroup.get('selectedbrowserSystemList').clearValidators();
        this.thirdFormGroup.get('selectedbrowserSystemList').updateValueAndValidity();
      }
      
}}

resetData(step){  
  if (step == 1)
  {
      this.testSuits = [];
      this.testCases = [];
      this.browserSystemList = [];
      this.selctedApplication = '';
      this.panelOpenState = true;
  }  
}

isItemSelected : boolean = false;
//#endregion
}

