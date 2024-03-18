import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  userData!: User;
  focus1 = false;

  isClicked: boolean = false;
  errors: any[] = [];

  constructor(
    private auth: MyOriginAuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('settings-page');
    this.getUser();
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('settings-page');
  }

  getUser() {
    const userId = this.auth.getUserId();
    this.userService.getUserById(userId).subscribe(
      (foundUser) => {
        this.userData = foundUser;
        this.isClicked = false;
      },
      (errorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
        this.isClicked = false;
      }
    );
  }

  updateUser(userForm: NgForm) {
    this.isClicked = true;

    this.auth.updateUser(this.userData._id, userForm.value).subscribe(
      (UserUpdated) => {
        userForm.reset(userForm.value);
        this.showSwalSuccess();
      },
      (errorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
        this.isClicked = false;
      }
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private showSwalSuccess() {
    Swal.fire({
      icon: 'success',
      text: 'ユーザー情報が更新されました！',
      customClass: {
        confirmButton: 'btn btn-primary btn-lg',
      },
      buttonsStyling: false,
    }).then(() => {
      this.router.navigate(['/user', this.auth.getUserId()]);
    });
  }
}
