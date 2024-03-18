import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCardComponent } from './list-card.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ListCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [ListCardComponent],
  providers: [],
})
export class ListCardModule {}
