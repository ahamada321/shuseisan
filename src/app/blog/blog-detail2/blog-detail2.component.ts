import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { Prompt } from 'src/app/prompt/shared/prompt.model';
import { PromptService } from 'src/app/prompt/shared/prompt.service';

@Component({
  selector: 'app-blog-detail2',
  templateUrl: './blog-detail2.component.html',
  styleUrls: ['./blog-detail2.component.scss'],
})
export class BlogDetail2Component implements OnInit {
  title: string = '自分について深く知りたい時に';
  description: string =
    '毎日がマンネリで退屈...私って何が好きなんだっけ...。自分のことなのに自分がわからない、そんな時に忘れていた自分を呼び起こせる自己分析をしたい方はこちら';
  prompt!: Prompt;

  constructor(
    private titleService: Title,
    private meta: Meta,
    public auth: MyOriginAuthService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.getPrompt('65b4eec6eb357896bbc94c3b'); // Prod
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
