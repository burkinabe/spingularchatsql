import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { SpingularchatsqlSharedModule } from 'app/shared/shared.module';
import { SpingularchatsqlCoreModule } from 'app/core/core.module';
import { SpingularchatsqlAppRoutingModule } from './app-routing.module';
import { SpingularchatsqlHomeModule } from './home/home.module';
import { SpingularchatsqlEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { ChatService } from 'app/shared/chat/chat.service';

@NgModule({
  imports: [
    BrowserModule,
    SpingularchatsqlSharedModule,
    SpingularchatsqlCoreModule,
    SpingularchatsqlHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    SpingularchatsqlEntityModule,
    SpingularchatsqlAppRoutingModule
  ],
  declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  providers: [ChatService],
  bootstrap: [JhiMainComponent]
})
export class SpingularchatsqlAppModule {}
