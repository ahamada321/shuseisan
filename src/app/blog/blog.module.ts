import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogChatComponent } from './blog-chat/blog-chat.component';
import { ListCardModule } from '../shared/list-card/list-card.module';
import { BlogDetail2Component } from './blog-detail2/blog-detail2.component';
import { BlogDetail3Component } from './blog-detail3/blog-detail3.component';
import { BlogDetail4Component } from './blog-detail4/blog-detail4.component';
import { BlogDetail5Component } from './blog-detail5/blog-detail5.component';
import { BlogDetail6Component } from './blog-detail6/blog-detail6.component';

const routes: Routes = [
  {
    path: 'blog',
    component: BlogComponent,
    children: [
      { path: 'english', component: BlogDetailComponent },
      { path: 'self-compassion', component: BlogDetail2Component },
      { path: 'mail-communication', component: BlogDetail3Component },
      { path: 'how-to-use-prompt', component: BlogDetail4Component },
      { path: 'how-to-use-chatgpt', component: BlogDetail5Component },
      { path: 'tutorial', component: BlogDetail6Component },
    ],
  },
];

@NgModule({
  declarations: [
    BlogComponent,
    BlogDetailComponent,
    BlogDetail2Component,
    BlogDetail3Component,
    BlogDetail4Component,
    BlogDetail5Component,
    BlogDetail6Component,
    BlogChatComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), ListCardModule],
  providers: [],
})
export class BlogModule {}
