


import { NgModule } from '@angular/core';
import { Route, Routes } from '@angular/router/src/config';
import { RouterModule } from '@angular/router';
import { AutomationStepComponent } from '../../automation-step/automation-step.component';
import { WelcomeComponent } from '../../home/welcome.component';
import { AutomationChartComponent } from '../../chart/automation-chart.component';
import { TestAutomationResultComponent } from '../../chart/test-automation-result.component';
import { TestCaseHistoryComponent } from '../../chart/test-case-history.component';
import { AuthGuard } from '../guard/auth.guard';
import { CompletedTestResultsComponent } from '../../chart/completed-test-results.component';

 const routes : Routes = [   
  {path:'welcome', component:WelcomeComponent},   
  { path: 'Schedule', component: AutomationStepComponent, canActivate:[AuthGuard]},  
  { path: 'Schedule/:id', component: AutomationStepComponent, canActivate:[AuthGuard]},  
  { path: 'Dashboard', component: AutomationChartComponent,canActivate:[AuthGuard]},
  { path: 'OATCompletedTestResult', component: CompletedTestResultsComponent,canActivate:[AuthGuard]},
  { path: 'OATResult/:submissionId', component: TestAutomationResultComponent,canActivate:[AuthGuard]}, 
  { path: 'OATHistory/:SubmittedTestID', component: TestCaseHistoryComponent,canActivate:[AuthGuard]},   
  //End  
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome', pathMatch: 'full' }
];  



@NgModule({
  imports: [     
    RouterModule.forRoot(routes)    
  ],
  exports: [
    RouterModule    
  ],
 // providers:[AuthService, OrderService]
})
export class AppRouteModuleModule { }
