import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-business-mail',
  templateUrl: './business-mail.component.html',
  styleUrls: ['./business-mail.component.scss'],
})
export class BusinessMailComponent implements OnInit {
  title: string = '取引先や上司に送るビジネスメール作成に';
  description: string =
    '「大事なメールを送る際にミスが多いのを直したい」「メール文章の誤字脱字を手軽に直したい」そんな方へ、1分以内で文章チェックしてもらえる超有能ツールが今なら無料で使えます';

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
