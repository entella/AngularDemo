import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { ScheduleAutomationModel } from "../model/ScheduleAutomation-Model";

@Injectable()
export class AutomationService {

  private webApiUrl = 'http://qa-client5:1776/Api/';
   // private webApiUrl = 'http://localhost:1785/Api/';
    //private webApiUrl = 'http://localhost:81/Api/';
   

    //Construtor: Used to pass httpClient dependency to Automation service
    constructor(private http: HttpClient){ }

    //GetData : used to call reset service and passs data component
    getData(route): Observable<any> {
        return this.http.get(this.webApiUrl + route)           
            .catch(this.handleError);          
    }

    getDataById(route, Id): Observable<any> {
        return this.http.get(this.webApiUrl + route +'/' + Id )
            // .do(data => console.log('getProduct: ' + JSON.stringify(data)))           
            .catch(this.handleError); 
    } 

    getChartSummary(route): Observable<any> {
        return this.http.get(this.webApiUrl + route)                   
            .catch(this.handleError);          
    } 

    getCompletedTestResult(route, fromDate,toDate): Observable<any> {
        return this.http.get(this.webApiUrl + route + '?fromDate='+ fromDate + '&toDate='+ toDate)                   
            .catch(this.handleError);          
    } 

    GetTestCaseHistory(days, TestCaseId, EnvironmentId, BrowserId, ShowDebugRuns): Observable<any> {

        return this.http.get(this.webApiUrl + 'TestCase/GetTestCaseHistory'+'/' + days + '/'+ TestCaseId + '/' + EnvironmentId + '/'+
        BrowserId + '/'+ShowDebugRuns )                   
            .catch(this.handleError);          
    } 



    //PostData: Used to call POST JSON method
    postData(model: ScheduleAutomationModel, route): Observable<any> {        
        return this.http.post(this.webApiUrl+ route, model)           
            .catch(this.handleError);
    }

    private handleError(error: Response): Observable<any> {      
      console.log(error);
      return Observable.throw(error || 'Server error');
     }
  
     putData(submittedTestId, route): Observable<any> {   
         let  obj = {
            SubmittedTestID:submittedTestId
        }    

        return this.http.put(this.webApiUrl+ route, obj)         
            .catch(this.handleError);
    }

  }
