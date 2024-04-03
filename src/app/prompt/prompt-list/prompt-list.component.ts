import { Component, OnInit } from '@angular/core';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';
import { ClickService } from '../shared/click.service';
import { Router } from '@angular/router';
import { PromptService } from '../shared/prompt.service';
import Swal from 'sweetalert2';

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
  sampleText: string =
    '以下は誤記サンプル文です。\n恐れ入りますが、また明日になりましてお電話のお時間をご連絡せていただきますので引き続きどうぞよろしくお願い致します。';
  sampleResult: string =
    '恐れ入りますが、また明日になりましたらお電話の時間をご連絡いたします。よろしくお願いいたします。';
  isClicked: boolean = false;
  isCopied: boolean = false;
  errors: any;
  count: number = 0;
  clicks: number = 0;

  constructor(
    private router: Router,
    public auth: MyOriginAuthService,
    private clickService: ClickService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    if (!this.clickService.isExpired()) {
      this.clicks = this.clickService.getClicks();
    }
  }

  onClick() {
    this.isClicked = true;
    if (!this.clickService.hasExceededMaxClicks()) {
      this.clicks = this.clickService.incrementClick();
      this.clickService.updateLastClickTime();

      if (this.text.includes('以下は誤記サンプル文です。\n')) {
        setTimeout(() => {
          if (this.text === this.sampleText) {
            this.result = this.sampleResult;
          } else {
            this.result = '修正したい文章のみを入力してください。';
          }
          this.isClicked = false;
        }, 1500); // Wait 1500ms
        return;
      }

      this.promptService.postPrompt({ prompt: this.text }).subscribe(
        (result) => {
          this.result = result;
          this.isClicked = false;
        },
        (err) => {
          console.error(err);
          this.isClicked = false;
        }
      );
    } else {
      console.error('Exceeded maximum clicks or expired');
      this.isClicked = false;
    }
  }

  insertSampleText() {
    this.text = this.sampleText;
  }

  copyResult() {
    // Copy to clipboard
    navigator.clipboard.writeText(this.result);

    if (
      this.clickService.hasExceededMaxClicks() &&
      !this.clickService.isNotFirstExceed()
    ) {
      this.showSwalInfo();
    }
  }

  shareTwitter() {
    const URL = 'https://twitter.com/intent/post?';
    window.open(
      URL +
        'text=誤字脱字・文章の違和感を簡単修正' +
        '&hashtags=修正さん' +
        '&url=https://www.shuseisan.com',
      '_blank'
    );
  }

  showSwalInfo() {
    Swal.fire({
      icon: 'info',
      title: 'ホーム画面に追加しましょう',
      html: `
      <p>スマートフォンをご利用の方は、<br>ホーム画面に「修正さん」追加することで、<br>また簡単にアクセスできます。</p>
      <p>12時間後に再び修正できるようになります。</p>
    `,
      customClass: {
        confirmButton: 'btn btn-success btn-lg',
      },
      confirmButtonText: `
      ホーム画面へ追加する方法を見る
    `,
      allowOutsideClick: false,
      buttonsStyling: false,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/how-to-add-to-homescreen']);
      }
    });
  }
}
