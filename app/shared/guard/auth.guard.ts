import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonDataService } from '../../automation-step/common-data.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private _commonDataService : CommonDataService, private router: Router ){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {    
      
      //If user us is Authorized and have scheduling permission then return true 
      if (this._commonDataService._userInfo && this._commonDataService._userInfo.isAuthorized && state.url.toLowerCase() == '/schedule' && this._commonDataService._userInfo.canScheduleTests) 
        return true;
        //If user is Authorized then only can view pages
     else if (this._commonDataService._userInfo && this._commonDataService._userInfo.isAuthorized  && state.url.toLowerCase() != '/schedule') 
        return true;
        // If user is not Authorized then user will only view the welcome page
      else  {     
        this.router.navigateByUrl('/welcome');   
        return false;
      }
  }
}
