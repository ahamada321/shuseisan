import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-blog-detail6',
  templateUrl: './blog-detail6.component.html',
  styleUrls: ['./blog-detail6.component.scss'],
})
export class BlogDetail6Component implements OnInit {
  title: string = '初めての使い方ガイド';
  description: string =
    'ChatGPTでプロンプトを使うと高品質な回答が来るって聞いたけど、プロンプトってどうやって使うの？チャットGPTを使いこなしたい！という方はこちら';

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
