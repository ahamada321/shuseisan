import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
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
    this.titleService.setTitle('修正さん | ' + this.title);

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
