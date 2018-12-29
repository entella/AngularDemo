import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { MaterialModule } from './shared/modules/material.module';
import {FlexLayoutModule} from '@angular/flex-layout'

//import {AsyncLocalStorageModule} from 'angular-async-local-storage';
import { AppRouteModuleModule } from './shared/modules/app-route-module.module';
import { CommonDataService } from './automation-step/common-data.service';
import { AutomationService } from './automation-step/automation.service';
import { WinAuthInterceptor } from './automation-step/win-auth-interceptor';

import { WelcomeComponent } from './home/welcome.component';
import { SidenavComponent } from './shared/component/sidenav/sidenav.component';
import { ToolbrComponent } from './shared/component/toolbr/toolbr.component';
import { AutomationChartComponent } from './chart/automation-chart.component';
import { loader } from './shared/component/loader/loader.component';

import { AutomationStepComponent } from './automation-step/automation-step.component';
import { FilterTestCasePipe } from './shared/pipe/filter-test-case.pipe'
import{TestAutomationResultComponent} from './chart/test-automation-result.component';
import { TestCaseHistoryComponent } from './chart/test-case-history.component';
import { TruncatePipe } from './shared/pipe/limit-to.pipe';
import { MatDialogComponent } from './shared/component/dialog/mat-dialog.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CompletedTestResultsComponent } from './chart/completed-test-results.component';
//import { MatDialogComponent } from './shared/component/dialog/mat-dialog.component'


@NgModule({
  declarations: [
    AppComponent,
    FilterTestCasePipe,
    WelcomeComponent,    
    AutomationStepComponent,    
    SidenavComponent,
    ToolbrComponent,
    AutomationChartComponent,
    loader, 
    TestAutomationResultComponent, 
    TestCaseHistoryComponent, 
    TruncatePipe, MatDialogComponent, CompletedTestResultsComponent   
  ],
  entryComponents:[
    MatDialogComponent
  ],
  imports: [
    AppRouteModuleModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [ 
    AuthGuard,
   AutomationService,
    {
     provide: HTTP_INTERCEPTORS,
     useClass: WinAuthInterceptor,
     multi: true,
   },
   CommonDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
