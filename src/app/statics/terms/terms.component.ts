import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  description: string =
    'チャットGPTの可能性を最大限に引き出すプロンプト(指令文)テンプレで使っているChatGPTを活用しよう！';

  constructor(private meta: Meta) {}

  ngOnInit() {
    this.updateMeta();
  }

  updateMeta() {
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
