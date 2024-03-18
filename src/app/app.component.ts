import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MyOriginAuthService } from './auth/shared/auth.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

var lastScrollTop = 0;
var delta = 5;
var navbarHeight = 0;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  titlee!: string; // Added by Hamada
  private lastPoppedUrl?: string;
  private yScrollStack: number[] = [];
  @ViewChild(NavbarComponent, { static: false }) navbar!: NavbarComponent;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    public location: Location,
    public auth: MyOriginAuthService,
    private gtmService: GoogleTagManagerService
  ) {
    this.gtmService.addGtmToDom();
  }

  ngOnInit() {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        this.navbar.sidebarClose();

        // Below code is using at Bottom Nav bar.
        const locationPath = this.location.prepareExternalUrl(
          this.location.path()
        );
        this.titlee = locationPath.slice(1);
        // Bottom Nab bar control end.

        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop()!);
        } else window.scrollTo(0, 0);
      }
    });
  }

  // removeFooter() {
  //   var titlee = this.location.prepareExternalUrl(this.location.path());
  //   titlee = titlee.slice(1);
  //   if (titlee === 'register') {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  isMobile() {
    let innerWidth = window.innerWidth;
    if (innerWidth < 530) {
      return true;
    } else {
      return false;
    }
  }
}
