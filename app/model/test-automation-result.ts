export class TestAutomationResult {
    SubmittedTestID : number;
    TestCaseName : string;
    TestBrowserOneStatus : number;
    TestBrowserTwoStatus : number;
    TestBrowserThreeStatus : number;
    TestBrowserFourStatus : number;
    TestBrowserFiveStatus : number;
}


export interface   ITestAutomationResult {

    results : TestAutomationResult[];
    totalRecords : number;
}