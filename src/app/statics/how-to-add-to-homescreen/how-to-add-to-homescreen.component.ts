import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MyOriginAuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-how-to-add-to-homescreen',
  templateUrl: './how-to-add-to-homescreen.component.html',
  styleUrls: ['./how-to-add-to-homescreen.component.scss'],
})
export class HowToAddToHomescreenComponent implements OnInit {
  title: string = '修正さんはスマホのホーム画面から使えます';
  description: string =
    '「修正さん」に簡単にアクセスするにはどうすればいいの？という方向けにホーム画面に追加する方法をご紹介！';

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
