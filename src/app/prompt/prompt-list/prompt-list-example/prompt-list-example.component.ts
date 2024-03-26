import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-prompt-list-example',
  templateUrl: './prompt-list-example.component.html',
  styleUrls: ['./prompt-list-example.component.scss'],
})
export class PromptListExampleComponent implements OnInit {
  isDragging!: boolean;
  customOptions: OwlOptions = {
    items: 1,
    margin: 50,
    loop: true,
    center: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    dotsEach: true,
    navSpeed: 700,
  };
  constructor() {}
  ngOnInit() {}
}
