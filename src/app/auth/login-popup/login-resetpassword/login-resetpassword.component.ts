import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyOriginAuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-resetpassword',
  templateUrl: './login-resetpassword.component.html',
  styleUrls: ['./login-resetpassword.component.scss'],
})
export class LoginResetpasswordComponent implements OnInit, OnDestroy {
  focus!: boolean;
  loginForm!: FormGroup;
  isClicked!: boolean;
  errors: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private auth: MyOriginAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    this.initForm();
  }

  ngOnDestroy() {
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          ),
        ],
      ],
    });
  }

  isInvalidForm(fieldname: any): boolean {
    return (
      this.loginForm.controls[fieldname].invalid &&
      (this.loginForm.controls[fieldname].dirty ||
        this.loginForm.controls[fieldname].touched)
    );
  }

  sendPasswordResetLink() {
    this.isClicked = true;
    this.auth.sendPasswordResetLink(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/login/reset/sent']);
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
        this.isClicked = false;
      }
    );
  }
}
