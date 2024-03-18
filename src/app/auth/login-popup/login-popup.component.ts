import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent implements OnInit {
  isClicked: boolean = false;
  loginForm!: FormGroup;
  errors: any[] = [];
  promptId!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private auth: MyOriginAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.initForm();
    const titlee = this.location.prepareExternalUrl(this.location.path());
    if (
      titlee.split('/')[1] === 'prompt' &&
      titlee.split('/')[2] !== undefined
    ) {
      this.promptId = titlee.split('/')[2];
    } else {
      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        this.promptId = params['promptId'];
      });
    }
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  isInvalidForm(fieldName: any): boolean {
    return (
      this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty ||
        this.loginForm.controls[fieldName].touched)
    );
  }

  closePopup() {
    this.activeModal.close('Close click');
    const titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.split('/')[1] === 'register') {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.isClicked = true;
    this.auth.login(this.loginForm.value).subscribe(
      (token) => {
        this.activeModal.close('Close click');
        if (this.promptId) {
          this.router.navigate(['/prompt', this.promptId]);
          return;
        }
        this.router.navigate(['/user']);
      },
      (errorResponse: HttpErrorResponse) => {
        console.error(errorResponse);
        this.errors = errorResponse.error.errors;
        this.isClicked = false;
      }
    );
  }
}
