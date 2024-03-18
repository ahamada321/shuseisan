import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TermsComponent } from './terms/terms.component';
import { TermsTextModule } from './terms/helpers/terms-text/terms-text.module';
import { FaqComponent } from './faq/faq.component';
import { Page404Component } from './page404/page404.component';

const routes: Routes = [
  { path: 'terms', component: TermsComponent },
  //   { path: 'privacy', component: PrivacyComponent },
  { path: 'faq', component: FaqComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  declarations: [TermsComponent, FaqComponent, Page404Component],
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
