import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { QuillConfigModule, QuillModule } from 'ngx-quill';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, BottomNavComponent],
  imports: [
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    QuillModule.forRoot(),
    QuillConfigModule.forRoot({
      modules: {
        toolbar: [
          [{ header: [3, 4, 5, false] }],
          [{ color: [] }, { background: [] }],
          ['bold', 'underline'],
          // ['code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    }),
    AppRoutingModule,
  ],
  providers: [{ provide: 'googleTagManagerId', useValue: 'G-QQVD3FTV9V' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
