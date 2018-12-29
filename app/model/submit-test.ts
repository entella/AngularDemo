import { KeyValueModel } from "./common";

export class SubmitTestModel {

    submittedTestId : string = '';
    testEnvironmentId: number = null;
    result: string = '';
    Notes: string = '';
    testsPassed : string = '';
    testFailed : number = null;
    testRequestedBy : string = '';
    submittedTestTimeOut : Number = null;
    isDebugRun : boolean = false;
    reservationMinutes : number = null;
    OperatingSystemTestBrowserPairs  : KeyValueModel[]
    testCase  : KeyValueModel[]
    
    testSuites : KeyValueModel[];  
    scheduleRunType  : number = null;
    testDescription : string ='';
    applicationId : number = null;    
}

class testSuites
{
    testSuiteId : number = null;
    testSuite : string  = '' ;
}

enum testTypeEnum {
    TestSuite = 1,
    Feature =2,
    TestCase = 3   
}