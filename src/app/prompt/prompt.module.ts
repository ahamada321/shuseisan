import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { PromptComponent } from './prompt.component';
import { PromptListComponent } from './prompt-list/prompt-list.component';

import { QuillModule } from 'ngx-quill';
import { PromptService } from './shared/prompt.service';

const routes: Routes = [
  { path: '', component: PromptListComponent },
  // {
  //   path: 'prompt',
  //   component: PromptComponent,
  //   children: [
  //     { path: '', component: PromptSearchComponent },
  //     { path: 'new', component: PromptNewComponent, canActivate: [AuthGuard] },
  //     {
  //       path: 'edit/:promptId',
  //       component: PromptEditComponent,
  //       canActivate: [AuthGuard],
  //     },
  //     { path: ':promptId', component: PromptDetailComponent }, // Going to replace promptId to promptUri
  //   ],
  // },
];

@NgModule({
  declarations: [PromptComponent, PromptListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    QuillModule,
  ],
  providers: [PromptService],
})
export class PromptModule {}
