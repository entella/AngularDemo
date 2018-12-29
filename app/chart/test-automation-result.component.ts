import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutomationService } from '../automation-step/automation.service';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';


import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { Observable } from 'rxjs';
import {of as observableOf} from 'rxjs/observable/of';
import { ITestAutomationResult } from '../model/test-automation-result';
import { CommonDataService } from '../automation-step/common-data.service'
import { DatePipe } from '@angular/common';
import { MatDialogComponent } from '../shared/component/dialog/mat-dialog.component';

@Component({
  selector: 'app-test-automation-result',
  templateUrl: './test-automation-result.component.html',
  styleUrls: ['./test-automation-result.component.scss']
})
export class TestAutomationResultComponent implements OnInit {

  submissionId : number = 0;
  showLoader : boolean = false;
  testCaseWidth : number = 400;
  showAllColumn : boolean = false;


  //displayedColumns = ["TestCaseName",'TestBrowserOneStatus', 'TestBrowserTwoStatus', 'TestBrowserThreeStatus', 'TestBrowserFourStatus','TestBrowserFiveStatus'];
  displayedColumns:string[] = ["TestCaseName"];
  dataSource = new MatTableDataSource();

 // dataSource = new MatTableDataSource<TestAutomationResultComponent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults:boolean = true;

  resultsLength : number= 0;
  isRateLimitReached:boolean = false;
  errorMessage : string;
  color : string = 'red';
  alive: boolean = true;
  isAbortVisible : boolean=false;
  backgroundColor: string = '#9e9e9e0f'

  constructor(private route : ActivatedRoute, private router : Router,  private automationService : AutomationService, private _commonDataService:CommonDataService,public snackBar: MatSnackBar,private dialog: MatDialog ) { }

  ngOnInit() {

   this.route.params.subscribe(params => {

      this.submissionId = params['submissionId'];
      if (this.submissionId)
      {
      this.loadData(this.submissionId,false);
      }});

      //Page data will refresh after 15 minutes
      let httpSubscription = Observable.interval(1000 * 15);
      httpSubscription.takeWhile(() => this.alive).subscribe(i => this.loadData(this.submissionId,true));

  }

  loadData(submissionId : number, isAsync : boolean) : void
  {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

         merge(this.sort.sortChange, this.paginator.page)
         .pipe(
           startWith({}),
           switchMap(() => {
             this.isLoadingResults = true;
            if (!isAsync) this.showLoader =  true;
             return this.getAutomationResultBySubmittedId (submissionId);
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
         ).subscribe(data =>{
           this.dataSource.data = data;
           this.diplayAllColumn();
           if (data[0])
           this.isAbortVisible = this._commonDataService._userInfo.canAbortTest && data[0].TestResult == 5;
          }
        );
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

  getAutomationResultBySubmittedId(submissionId : number) : Observable<ITestAutomationResult>{
    return this.automationService.getDataById('TestCase/GetAutomationResultBySubmittedId',submissionId);
  }


  AutomationResultBySubmittedId(submissionId : number){
    this.automationService.getDataById('TestCase/GetAutomationResultBySubmittedId',submissionId)
    .subscribe(data =>{
        this.dataSource = data.results;
    }) ;
  }

  GetStatusNamebyId(statusId : any) : string{
    if (statusId == 0)
      return 'Failed';
    else if (statusId == 1)
      return  'Passed'
    else if (statusId == 3)
      return  'Timed Out'
    else if (statusId == 4)
    return  'Aborted'
    else if (statusId == 5)
      return  'Running'
      else
      return '';
  }

  back():void{
    if (this._commonDataService._ActiveParentResultPage == 1)
       this.router.navigateByUrl('Dashboard');
    else
      this.router.navigateByUrl('OATCompletedTestResult');
  }

  abortTest (submissionId : number): void{
    if (confirm("Are sure you want to Abort Test case " + submissionId + " ?")){
      let result;
      this.automationService.putData(submissionId,'TestCase/AbortTest')
      .subscribe(data =>{
        if(data)
        this.openSuccessSnackBar('Test Case - ' + submissionId + ' is Aborted ' ,'success')
      }) ;
  }
 }

 openSuccessSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
  });
}

dateFormate(date):any{
if (date == '0001-01-01T00:00:00' )
      return 'NA';
    else
    return new DatePipe ("en-US").transform(date, 'MM/dd/yyyy  HH:mm:ss');
}

filterResult: any;
diplayAllColumn():void{
  if (this.showAllColumn)
  {
      this.filterResult =  this.dataSource.data.filter(result => result['TestMachineResult'] !=null)
      if (this.filterResult && this.filterResult.length > 0)        
          this.displayedColumns = ['TestCaseName','TestMachineResult','TestBrowserOneStatus', 'TestBrowserTwoStatus', 'TestBrowserThreeStatus', 'TestBrowserFourStatus','TestBrowserFiveStatus'];
      else
        this.displayedColumns = ['TestCaseName','TestBrowserOneStatus', 'TestBrowserTwoStatus', 'TestBrowserThreeStatus', 'TestBrowserFourStatus','TestBrowserFiveStatus'];

}  else
      {


        this.displayedColumns = ["TestCaseName"];

        this.filterResult =  this.dataSource.data.filter(result => result['TestBrowserOneStatus'] !=null)
        if (this.filterResult && this.filterResult.length > 0)
          this.displayedColumns.push('TestBrowserOneStatus');
          
          this.filterResult =  this.dataSource.data.filter(result => result['TestMachineResult'] !=null)
        if (this.filterResult && this.filterResult.length > 0)
          this.displayedColumns.push('TestMachineResult');

        this.filterResult =  this.dataSource.data.filter(result => result['TestBrowserTwoStatus'] !=null)
        if (this.filterResult && this.filterResult.length > 0)
          this.displayedColumns.push('TestBrowserTwoStatus');

        this.filterResult =  this.dataSource.data.filter(result => result['TestBrowserThreeStatus'] !=null)
        if (this.filterResult && this.filterResult.length > 0)
          this.displayedColumns.push('TestBrowserThreeStatus');

        this.filterResult =  this.dataSource.data.filter(result => result['TestBrowserFourStatus'] !=null)
        if (this.filterResult && this.filterResult.length > 0)
          this.displayedColumns.push('TestBrowserFourStatus');

        this.filterResult =  this.dataSource.data.filter(result => result['TestBrowserFiveStatus'] !=null)
        if (this.filterResult && this.filterResult.length > 0)
          this.displayedColumns.push('TestBrowserFiveStatus');
      }
      
}

openDialog() : void{
  var data =  this.dataSource.data.filter(result => result['QALogFileUNCPath'] !=null)

  let dialogRef = this.dialog.open(MatDialogComponent, { 
    height:'40vw',
    width:'60vw',     
    data: {
      testArtifactPath: data[0]["QALogFileUNCPath"],
      submittedTestID : this.submissionId,
      testMachineName : data[0]["TestMachineName"],
      id : 'history'
    }
  });
}

ngOnDestroy(){
  this.alive = false;
  this.showLoader = false;
}
}
