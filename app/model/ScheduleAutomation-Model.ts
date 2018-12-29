import { KeyValueModel } from "./common";

export class ScheduleAutomationModel {
    submittedTestId : string = '';
    testEnvironmentId: number = null;
    result: string = '';
    Notes: string = '';
    testDescription: string ='';
    testsPassed : number = null;
    testFailed : number = null;
    testCompleted : number = null;
    testRequestedBy : string = '';
    submittedTestTimeOut : Number = null;
    isDebugRun : boolean = false;
    reservationMinutes : number = null;
    OperatingSystemTestBrowserPairs  : OperatingSystemTestBrowser[]
    testCases  : testCase[]   
}


class OperatingSystemTestBrowser
{
    operatingSystemID : number;
    testBrowserId : number;    
}
class testCase
{
    testCaseId : number = null;
    testCase : string = ''  
}