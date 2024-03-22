import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { ClickService } from '../shared/click.service';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PromptService } from '../shared/prompt.service';

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
  count: number = 0;
  clicks: number = 0;

  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    public auth: MyOriginAuthService,
    private clickService: ClickService,
    private location: Location,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.updateTitleAndMeta();
    if (this.clickService.isExpired()) {
      this.clickService.updateLastClickTime();
    } else {
      this.clicks = this.clickService.getClicks();
    }
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

  onClick() {
    this.isClicked = true;
    if (
      !this.clickService.hasExceededMaxClicks() &&
      !this.clickService.isExpired()
    ) {
      this.clickService.incrementClick();
      this.clicks = this.clickService.getClicks();
      this.clickService.updateLastClickTime();
      console.log('Click incremented');
      this.promptService.postPrompt({ prompt: this.text }).subscribe(
        (result) => {
          this.result = result.text;
          debugger;
        },
        (err) => {
          debugger;
          console.error(err);
        }
      );
      this.isClicked = false;
    } else {
      console.log('Exceeded maximum clicks or expired');
      this.isClicked = false;
    }
  }

  sendText(textForm: any) {}

  shareTwitter() {
    const URL =
      'https://twitter.com/intent/tweet?url=https://www.copy-prompt.com';
    const PATH = this.location.path();
    window.open(
      URL +
        PATH +
        '&text=%0A' +
        '文章を簡単に整えてくれる修正さん' +
        '&hashtags=修正さん',
      '_blank'
    );
  }
}
