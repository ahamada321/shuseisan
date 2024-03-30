import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Page404Component } from './page404/page404.component';
import { TermsComponent } from './terms/terms.component';
import { TermsTextModule } from './terms/helpers/terms-text/terms-text.module';
import { TutorialComponent } from './tutorial/tutorial.component';
import { ExampleComponent } from './example/example.component';
import { HowToAddToHomescreenComponent } from './how-to-add-to-homescreen/how-to-add-to-homescreen.component';

const routes: Routes = [
  { path: 'terms', component: TermsComponent },
  { path: 'tutorial', component: TutorialComponent },
  { path: 'example', component: ExampleComponent },
  {
    path: 'how-to-add-to-homescreen',
    component: HowToAddToHomescreenComponent,
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  declarations: [
    Page404Component,
    TermsComponent,
    TutorialComponent,
    ExampleComponent,
    HowToAddToHomescreenComponent,
  ],
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
