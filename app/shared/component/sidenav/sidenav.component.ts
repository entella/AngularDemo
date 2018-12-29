import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { MatSidenav, MatToolbar } from '@angular/material';
import { Router } from '@angular/router';
//import { AuthService } from '../../../user/auth.service';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {

   private mediaMatcher: MediaQueryList =
  matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

//users: Observable<customer[]>;

constructor( zone: NgZone,  private router: Router)
  {
  
    // this.mediaMatcher.addListener(mql =>
    // zone.run(() => this.mediaMatcher = mql));
  }

  pageTitle : '';

ngOnInit() {
    
} 

displayMessages(): void {
  this.router.navigate([{ outlets: { popup: ['messages'] } }]);
  //this.messageService.isDisplayed = true;
}

hideMessages(): void {
  this.router.navigate([{ outlets: { popup: null } }]);
  //this.messageService.isDisplayed = false;
}

logOut(): void {
  //this.authService.logout();
  this.router.navigateByUrl('/login');
}

}
