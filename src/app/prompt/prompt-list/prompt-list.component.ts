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
    '送信したメールを見返したら誤字を発見...となる前に！誤字脱字や句読点、違和感があっても直せない文章を簡単に直してもらえる';
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
      URL + PATH + '誤字脱字・文章の違和感を簡単修正' + '&hashtags=修正さん',
      '_blank'
    );
  }
}
