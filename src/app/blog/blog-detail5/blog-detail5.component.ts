import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-blog-detail5',
  templateUrl: './blog-detail5.component.html',
  styleUrls: ['./blog-detail5.component.scss'],
})
export class BlogDetail5Component implements OnInit {
  title: string = '初めてのChatGPTの使い方';
  description: string =
    'ChatGPTを使ってみたいけど、使い方がわからない。そうお困りの方はこのページを見れば使い方がわかります！チャットGPTを使いこなすなら';

  constructor(
    private titleService: Title,
    private meta: Meta,
    public auth: MyOriginAuthService
  ) {}

  ngOnInit() {
    this.updateTitleAndMeta();
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
