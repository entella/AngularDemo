import { Component, OnInit, ViewChild } from '@angular/core';
import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { Observable } from 'rxjs';
import {of as observableOf} from 'rxjs/observable/of';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ITestCaseSummary } from '../model/test-case-summary';
import { AutomationService } from '../automation-step/automation.service';
import { CommonDataService } from '../automation-step/common-data.service';



@Component({
  selector: 'app-completed-test-results',
  templateUrl: './completed-test-results.component.html',
  styleUrls: ['./completed-test-results.component.scss']
})
export class CompletedTestResultsComponent implements OnInit {


  showLoader : boolean = false;
  fromDate : Date = new Date();
  toDate : Date = new Date();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults:boolean = true;  

  displayedColumns = ["SubmittedTestID",'Failed', 'Passed', 'TimedOut', 'Aborted','Running'];
  //completedTestSummary: ITestCaseSummary[];
  dataSource = new MatTableDataSource();

  resultsLength : number= 0;
  
  constructor(private automationService:AutomationService,private _commonDataService: CommonDataService) {

    //by default only one month records will dispaly 
    this.fromDate.setMonth (this.toDate.getMonth() - 1)
   }

  ngOnInit() {
    this.LoadCompletedTestCaseSummary();
    this._commonDataService._ActiveParentResultPage = 2;
  }

  //#region Completed Test Case section

LoadCompletedTestCaseSummary(): void{
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
         merge(this.sort.sortChange, this.paginator.page)
         .pipe(
           startWith({}),
           switchMap(() => {
             this.isLoadingResults = true;
              this.showLoader =  true;
             return this.getCompleteTestSummary();           
           }),
           map(data => {
             // Flip flag to show that loading has finished.
             this.isLoadingResults = false;            
             this.resultsLength = data.totalRecords;
             this.showLoader =  false;
             return data.results;
           }),
           catchError(() => {
             this.isLoadingResults = false;
             // Catch if the GitHub API has reached its rate limit. Return empty data.
             //this.isRateLimitReached = true;
             return observableOf([]);
           })
         )
         .subscribe(data => {this.dataSource.data = data
        });
  }

  getCompleteTestSummary() : Observable<ITestCaseSummary>{   
    return this.automationService.getCompletedTestResult('TestCase/GetCompleteTestSummary',this.fromDate.toUTCString(),this.toDate.toUTCString());
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

  ngOnDestroy(){   
    this.showLoader = false;
  }
  
//#endregion

}
