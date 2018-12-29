import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TestSuiteModel } from '../model/test-suite-model';
import { TestCaseModel } from '../model/test-case-model';
import { AutomationService } from '../automation-step/automation.service';
import { KeyValueModel } from '../model/common';
import { FunctionalAreaModel } from '../model/functional-area-model';
import { testEnvironment } from '../model/test-environment';
import { TestBrowserOperatingSystem } from '../model/test-browser-operating-system';

import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { Observable } from 'rxjs/Observable';
import {of as observableOf} from 'rxjs/observable/of';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig} from '@angular/material';


import { ITestCaseHistoryModel } from '../model/test-case-history-model';
import { CommonDataService } from '../automation-step/common-data.service';
import { MatDialogComponent } from '../shared/component/dialog/mat-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-test-case-history',
  templateUrl: './test-case-history.component.html',
  styleUrls: ['./test-case-history.component.scss']
})
export class TestCaseHistoryComponent implements OnInit {

  testSuits : TestSuiteModel[] =[];
  testCases : TestCaseModel[]=[];
  SubmittedTestHistory : any;

  functionalAreaList: FunctionalAreaModel[]=[];
  searchHistoryTypeList  : KeyValueModel[]=[];
  selectedSearchHistoryType : number = 1;
  environmentList:  testEnvironment[]=[];
  browserSystemList:TestBrowserOperatingSystem[]=[];
  showLoader : boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults:boolean = true;  

  resultsLength : number= 0;
  isRateLimitReached:boolean = false;
  SubmittedTestID: number = 0;
  testSuiteID: number = 0;
  selectedTestCaseId : number = 0;
  selectedTestBrowserId: number = 0;
  selectedTestEnvironmentId: number = 0;
  totalDays:number= 10;
  testCaseWidth : 400;
  displayedColumns = ["SubmittedTestID",'TestcaseName', 'TestResult', 'TestMachineName', 'OperatingsyStemName','TestBrowserName','TestEnvironmentName','Note','EndDTTM'];
  dataSource = new MatTableDataSource();
  ShowDebugRuns : boolean = false;
  
  constructor(private automationService: AutomationService, public _commonDataService: CommonDataService, private dialog: MatDialog,private router : Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {     
      this.SubmittedTestID = params['SubmittedTestID'];   
    });
  

    this.LoadSearchHistoryType()
    this.getTestSuits();
    this.getFunctionalArea();
    this.getEnviornmentList();
    this.getBrowsers();
    this.getSubmittedTestHistoryById();

    this.activatedRoute.queryParams
    .subscribe(params => {     
      this.testSuiteID = +params['testSuiteId'] || 0;
      this.selectedTestCaseId =  +params['testCaseId'] || 0;     
      if (this.testSuiteID>0)
        this.TestCaseTestSuiteId(this.testSuiteID);
    });

  }

  //#region populate drop down data methods

  LoadSearchHistoryType () : void{
    this.searchHistoryTypeList.push( 
      new KeyValueModel(1, "Test Suite"), 
      new KeyValueModel(2, "Feature / Functional Area" ))
  }

  getTestSuits() : void {
      
    this.automationService.getData('TestSuite')
    .subscribe( data=> {
      if (data)
     this.testSuits = data.list;
    })
  }

  getFunctionalArea(){   
    this.automationService.getData('FunctionalArea')
    .subscribe( data=> {
      if (data)     
        this.functionalAreaList = data.list
   
  })
  }


  TestCaseTestSuiteId(testSuiteID) : void {  
    this.testCases  = [];
    this.showLoader = true;  

          this.automationService.getDataById('TestCase/TestCaseTestSuiteId',testSuiteID )
            .subscribe( data=> {
              this.showLoader = false;
              if (data)
              data.forEach(item  => {
                this.testCases.push(item);
            })
        })
   
  }
  getTestCaseByFunctionalAreaId(functionalAreaId) : void { 
          this.testCases  = [];
          this.showLoader = true;

          this.automationService.getDataById('TestCase/GetTestCaseByFunctionalAreaId',functionalAreaId )
            .subscribe( data=> {
              this.showLoader = false;
              if (data)
              data.forEach(item  => {
                this.testCases.push(item);
            })
        })    
  }

  getEnviornmentList():void{
    this.automationService.getData('TestEnvironment' )
    .subscribe( data=> {
      if (data)
     this.environmentList = data.list;
    }) 
   }

  getBrowsers():void{   
    this.automationService.getData('TestBrowser')
    .subscribe( data=> {
      if (data)     
        this.browserSystemList = data.list
   
  })
  }

  historyTypeChange(): void{
    this.testCases =[];

  }

  back():void{    
    this.router.navigateByUrl('/OATResult/'+ this.SubmittedTestID);
  }


  getSubmittedTestHistoryById():void{   
    this.automationService.getDataById('TestCase/GetSubmittedTestHistoryById' ,this.SubmittedTestID)
    .subscribe( data=> {
      if (data) {      
        this.selectedTestBrowserId =   data[0].TestBrowserId;  
        this.selectedTestEnvironmentId = data[0].TestEnvironmentId;    }
  })
  }

//#endregion



getHistory (): void{
this.loadData();
}
  loadData() : void
  {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
         merge(this.sort.sortChange, this.paginator.page)
         .pipe(
           startWith({}),
           switchMap(() => {
             this.isLoadingResults = true;
             this.showLoader =  true;
             return this.GetTestCaseHistory ();              
           }),
           map(data => {
             // Flip flag to show that loading has finished.
             this.isLoadingResults = false;
             this.isRateLimitReached = false;
             this.resultsLength = data.totalRecords;
             this.showLoader =  false;
             return data.results;
           }),
           catchError(() => {
             this.isLoadingResults = false;
             // Catch if the GitHub API has reached its rate limit. Return empty data.
             this.isRateLimitReached = true;
             return observableOf([]);
           })
         )
         .subscribe(data => this.dataSource.data = data);
  }

  /**
     * Set the paginator after the view init since this component will
     * be able to query its view for the initialized paginator.
     */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  GetTestCaseHistory() : Observable<ITestCaseHistoryModel>{    
    return this.automationService.GetTestCaseHistory(this.totalDays,this.selectedTestCaseId, isNaN(this.selectedTestEnvironmentId) ? 0 : this.selectedTestEnvironmentId, isNaN(this.selectedTestBrowserId) ? 0:this.selectedTestBrowserId ,this.ShowDebugRuns);     
  }

  openDialog(obj,Dialogtype) : void{
    let dialogRef = this.dialog.open(MatDialogComponent, { 
      height:'40vw',
      width:'60vw',     
      data: {
        testArtifactPath: obj.QALogFileUNCPath,
        submittedTestID : obj.SubmittedTestID,
        testMachineName : obj.TestMachineName,
        id:Dialogtype == 1 ?'history': 'docLocation'
      }
    });
  }

  ngOnDestroy(){    
    this.showLoader = false;
  }
  

}


