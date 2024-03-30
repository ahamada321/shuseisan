import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implements OnInit {
  title: string = '取引先や上司に送るビジネスメール作成に';
  description: string =
    '大事なメールを送る際にミスが多いのを直したい。文章の誤字脱字を直したい。そんな時にワンクリックで文章を校正できる「修正さん」';

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
