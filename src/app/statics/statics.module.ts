import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Page404Component } from './page404/page404.component';
import { TermsComponent } from './terms/terms.component';
import { TermsTextModule } from './terms/helpers/terms-text/terms-text.module';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  { path: 'terms', component: TermsComponent },
  { path: 'tutorial', component: TutorialComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  declarations: [Page404Component, TermsComponent, TutorialComponent],
  exports: [],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    TermsTextModule,
  ],
})
export class StaticModule {}
