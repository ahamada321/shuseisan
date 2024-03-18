import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private toggleButton: any;
  private sidebarVisible: boolean;

  constructor(
    public location: Location,
    private element: ElementRef,
    private modalService: NgbModal,
    public auth: MyOriginAuthService,
    private router: Router
  ) {
    this.sidebarVisible = false;
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  isLanding() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === '/') {
      return true;
    } else {
      return false;
    }
  }

  modalLoginOpen() {
    this.sidebarClose();
    this.modalService.open(LoginPopupComponent, { backdrop: 'static' });
  }

  logout() {
    this.auth.logout();
    this.sidebarClose();
    this.router.navigate(['/']);
  }
}
