import { Component, OnInit, Input } from '@angular/core';
import { Prompt } from '../../prompt/shared/prompt.model';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
})
export class ListCardComponent implements OnInit {
  @Input() prompt!: Prompt;

  constructor() {}

  ngOnInit() {}
}
