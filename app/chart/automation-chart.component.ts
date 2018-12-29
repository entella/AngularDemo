import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { AutomationService } from '../automation-step/automation.service';
import { Router } from '@angular/router';
import { CommonDataService } from '../automation-step/common-data.service';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import {of as observableOf} from 'rxjs/observable/of';
import { ITestCaseSummary } from '../model/test-case-summary';
declare var google: any;

@Component({
  templateUrl: './automation-chart.component.html',
  styleUrls: ['./automation-chart.component.scss']
})
export class AutomationChartComponent implements OnInit {



  showLoader : boolean = false;
  totalRecords : number = 0 ;
  alive: boolean = true;
  aliveDefulat: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults:boolean = true;  
  resultsLength : number= 0;
  autoRefreshTime : number= 15;

  displayedColumns = ["SubmittedTestID",'Failed', 'Passed', 'TimedOut', 'Aborted','Running','NotYetRun'];
  //completedTestSummary: ITestCaseSummary[];
  dataSource = new MatTableDataSource();
  historyData : any[];
 
  constructor( private automationService:AutomationService, private router: Router, private zone:NgZone,private _commonDataService: CommonDataService) {
    google.charts.load('current', {'packages':['corechart','bar']});
   }  


  ngOnInit() {
    //Wait 2 second if google.visualization.DataTable not initalize
    if (google.visualization){
      this.getChartSummary(false)
    }else
    {
        this.showLoader = true;
        let httpSubscriptionDefulat = Observable.interval(1000 * 2);
        httpSubscriptionDefulat.takeWhile(()=>this.aliveDefulat).subscribe(() => this.getChartSummary(false)
        );
    }
        
    //Page data will refresh after 15 minutes
    let httpSubscription = Observable.interval(1000 * this.autoRefreshTime);
    httpSubscription.takeWhile(()=>this.alive).subscribe(() => this.getChartSummary(true)
    );
  }

//#region Chart implementations
  getChartSummary(isAsync: boolean) : void{ 
    this.showLoader = isAsync ? false :true ; 
    this.automationService.getChartSummary('TestCase/GetRunningTestSummary')
    .subscribe( data=> {       
        this.showLoader = false;
        this.aliveDefulat = false;     
        this.historyData = data; 
        this.loadchart()      
    }) 
  }

  loadchart():void{
    if (this.historyData && this.historyData.length >0){
        google.charts.setOnLoadCallback(this.drawColumnChart(this.historyData));      
        this.LoadCompletedTestCaseSummary();
  }
  }

drawColumnChart(model): void{

    var visualizationModel = new google.visualization.DataTable(); 
    visualizationModel.addColumn('string', 'SubmittedTestID');  
    visualizationModel.addColumn('number', 'TimedOut'); 
    visualizationModel.addColumn('number', 'Failed');  
    visualizationModel.addColumn('number', 'Passed');     
    visualizationModel.addColumn('number', 'Running');
    visualizationModel.addColumn('number', 'Aborted');
    visualizationModel.addColumn('number', 'Not Yet Run');
  
  model.forEach(element => {
    visualizationModel.addRow([element.SubmittedTestID.toString(),this.returnNullIfZero(element.TimedOut),this.returnNullIfZero(element.Failed),this.returnNullIfZero(element.Passed),this.returnNullIfZero(element.Running),this.returnNullIfZero(element.Aborted),this.returnNullIfZero(element.NotYetRun)])
  });
  
 
//var array  = JSON.parse(model);
    var view = new google.visualization.DataView(visualizationModel);
    view.setColumns([0,1,
      { 
        calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation"
      
    },2, 
    {
        calc: "stringify",
        sourceColumn: 2,
        type: "string",
        role: "annotation"
    
    }
    ,3,
      {
        calc: "stringify",
        sourceColumn: 3,
        type: "string",
        role: "annotation" 

      } ,4,
      {
        calc: "stringify",
        sourceColumn: 4,
        type: "string",
        role: "annotation" 

      }  
      ,5,
      {
        calc: "stringify",
        sourceColumn: 5,
        type: "string",
        role: "annotation" 

      }  
      ,6,
      {
        calc: "stringify",
        sourceColumn: 6,
        type: "string",
        role: "annotation" 

      } 
      ]);

      this.totalRecords = model.length ;
      var chartwidth = 800;
      if ( this.totalRecords > 0)
      {
        chartwidth =  this.totalRecords* 30;
      }
      var options = {
      //  title: 'Currently Running Tests Results', 
        height: 450,
        fontSize : 11,    
        width: chartwidth < 1200 ? '100%' : chartwidth,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%'},
        isStacked: true,
        displayExactValues: true,
        //vAxis: { textPosition: 'none'},
        //vAxis: {title: "Number of running test cases "}, 
        hAxis: {title: "Submitted Test ID",
        textStyle : {
          fontSize: 11 // or the number you want
        }},  
        colors:[this._commonDataService.ColorEnum.TimedOut,this._commonDataService.ColorEnum.Failed,this._commonDataService.ColorEnum.Passed,this._commonDataService.ColorEnum.Running,this._commonDataService.ColorEnum.Aborted, this._commonDataService.ColorEnum.NotYetRun],
        chartArea:{
          width:"85%",
          top:50,
          bottom:60,
          right:0 ,
          left:30     
        }    
      };
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('myPieChart'));

      
        google.visualization.events.addListener(chart, 'select', ()=> {
          var selection = chart.getSelection();
          if(selection && selection.length > 0)
          {
            var submissionId = visualizationModel.getValue(selection[0].row,0)
          
          this.zone.run( () =>{
            this.navigateToResult(submissionId);
          })
          }
        
        });
        chart.draw(view, options);
        document.getElementById('myPieChart').style.cursor = 'pointer';
    }


    navigateToResult(submissionId): void{
      this._commonDataService._ActiveParentResultPage = 1;
      this.router.navigateByUrl('/OATResult/'+ submissionId );
    }

    returnNullIfZero(value : any): any{
    return value == 0 ? null : value;
    }

//#endregion


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
              return this.historyData;           
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;            
              this.resultsLength = this.historyData.length;
              this.showLoader =  false;
              return this.historyData;
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


//#endregion




ngOnDestroy(){
  this.alive = false;
  this.aliveDefulat = false;
  this.showLoader = false;
}

}



