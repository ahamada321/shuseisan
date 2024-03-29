import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-plan',
  templateUrl: './user-plan.component.html',
  styleUrls: ['./user-plan.component.scss'],
})
export class UserPlanComponent implements OnInit, OnDestroy {
  focus1 = false;
  activeTab = 1;
  isClicked: boolean = false;
  errors: any[] = [];

  constructor(private auth: MyOriginAuthService) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
