import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { Prompt } from 'src/app/prompt/shared/prompt.model';
import { PromptService } from 'src/app/prompt/shared/prompt.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit {
  title: string = '英会話の練習をしたい時に';
  description: string =
    'ネイティブの人と英会話したいけど、実際に誰かと話す勇気や労力、体力がない。そんな方に勇気も労力もお金もいらない最適な方法があります。詳しく知りたい方はこちら';
  prompt!: Prompt;

  constructor(
    private titleService: Title,
    private meta: Meta,
    public auth: MyOriginAuthService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.getPrompt('65b45e422f06012bff45bfba'); // Prod
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
