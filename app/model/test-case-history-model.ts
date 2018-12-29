export class TestCaseHistoryModel {

    SubmittedTestID : number;
    Result : number;
    TestcaseName : string;
    TestResult : string;
    TestMachineName : string;
    OperatingsyStemName : string;
    TestBrowserName :string;
    Note : string;
    EndDTTM : Date;
    QALogFileUNCPath : string;
}


export interface   ITestCaseHistoryModel {

    results : TestCaseHistoryModel[];
    totalRecords : number;
}