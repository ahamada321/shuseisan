import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blog-chat',
  templateUrl: './blog-chat.component.html',
  styleUrls: ['./blog-chat.component.scss'],
})
export class BlogChatComponent implements OnInit {
  @Input() message!: string;
  @Input() character: number = 2;

  constructor() {}

  ngOnInit() {}
}
