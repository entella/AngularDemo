export class TestCaseSummary {

    SubmittedTestID : number;
    Failed: number;
    Passed : number;
    TimedOut : number;
    Aborted : number;
    Running : number;
}


export class ITestCaseSummary {

    results : TestCaseSummary[];
    totalRecords : number;

}