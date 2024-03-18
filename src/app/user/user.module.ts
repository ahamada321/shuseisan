import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../auth/shared/auth.guard';

import { UserComponent } from './user.component';
import { UserService } from './shared/user.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserSettingsPasswordComponent } from './user-settings/user-settings-password/user-settings-password.component';
import { UserPlanComponent } from './user-plan/user-plan.component';

const routes: Routes = [
  { path: 'plan', component: UserPlanComponent },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', component: UserSettingsComponent, canActivate: [AuthGuard] },
      {
        path: 'password',
        component: UserSettingsPasswordComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    UserComponent,
    UserSettingsComponent,
    UserSettingsPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [UserService],
})
export class UserModule {}
