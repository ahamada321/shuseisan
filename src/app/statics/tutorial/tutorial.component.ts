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
    '「修正さん」ってどうやって使うの？という方向けの初めての使い方ガイドページです。ワンクリックで文章の誤字脱字を簡単修正。';

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
