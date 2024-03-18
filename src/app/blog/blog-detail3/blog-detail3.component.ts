import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { Prompt } from 'src/app/prompt/shared/prompt.model';
import { PromptService } from 'src/app/prompt/shared/prompt.service';

@Component({
  selector: 'app-blog-detail3',
  templateUrl: './blog-detail3.component.html',
  styleUrls: ['./blog-detail3.component.scss'],
})
export class BlogDetail3Component implements OnInit {
  title: string = '文章の誤字脱字を減らしたい時に';
  description: string =
    'メール文章の誤字脱字を手軽に直したい。そんな時に一瞬で正しい文章に直してくれる、そんな便利な方法が知りたい人はこちら';
  prompt!: Prompt;

  constructor(
    private titleService: Title,
    private meta: Meta,
    public auth: MyOriginAuthService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.getPrompt('65e546cae72b7e84013b3bbb'); // Prod
    // this.getPrompt('65b458188516101cf32a45a7'); // Dev
  }

  getPrompt(promptId: string) {
    this.promptService.getPromptById(promptId).subscribe((prompt: Prompt) => {
      this.prompt = prompt;
    });
  }

  updateTitleAndMeta() {
    this.titleService.setTitle(this.title + ' | 修正さん');

    this.meta.updateTag({
      name: 'description',
      content: this.description,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: this.description,
    });
  }
}
