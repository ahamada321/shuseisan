import { Component, OnInit } from '@angular/core';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.scss'],
})
export class PromptListComponent implements OnInit {
  description: string =
    'プロンプトテンプレをコピペするだけで、今まで使いこなせなかったChatGPTが超有能に生まれ変わる！';
  text: string = '';
  result: string = '';
  isClicked: boolean = false;
  errors: any;
  count: number = 3;
  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    public auth: MyOriginAuthService
  ) {}

  ngOnInit() {
    this.updateTitleAndMeta();
  }

  updateTitleAndMeta() {
    this.titleService.setTitle(
      'チャットGPTで時短！コピペで使える便利なテンプレート集 | 修正さん'
    );

    this.meta.updateTag({
      name: 'description',
      content: this.description,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: this.description,
    });
  }

  sendText(textForm: any) {}
}
