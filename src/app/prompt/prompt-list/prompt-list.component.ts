import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { ClickService } from '../shared/click.service';
import { Router } from '@angular/router';
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
  isCopied: boolean = false;
  errors: any;
  count: number = 0;
  clicks: number = 0;

  constructor(
    private router: Router,
    public auth: MyOriginAuthService,
    private clickService: ClickService,
    private location: Location,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    if (this.clickService.isExpired()) {
      this.clickService.updateLastClickTime();
    } else {
      this.clicks = this.clickService.getClicks();
    }
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

      this.promptService.postPrompt({ prompt: this.text }).subscribe(
        (result) => {
          this.result = result.text;
          this.isClicked = false;
        },
        (err) => {
          console.error(err);
          this.isClicked = false;
        }
      );
    } else {
      console.log('Exceeded maximum clicks or expired');
      this.isClicked = false;
    }
  }

  copyResult() {
    // ここでクリップボードにコピーするロジックを実装
    navigator.clipboard.writeText(this.result);
  }

  shareTwitter() {
    const URL =
      'https://twitter.com/intent/tweet?url=https://www.shuseisan.com';
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
