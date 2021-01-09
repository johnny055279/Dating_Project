import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// To Use Http Client, need to add it after the BrowserModule!!
import{ HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { SharedModule } from './_modules/shared/shared.module';
import { ErrorsComponent } from './errors/errors/errors.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { Page404Component } from './errors/page404/page404.component';
import { Page500Component } from './errors/page500/page500.component';

@NgModule({
  // 屬於此NgModule的Component、Directive與Pipe皆放置於此。
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailComponent,
    ListsComponent,
    MessagesComponent,
    ErrorsComponent,
    Page404Component,
    Page500Component
  ],

  // 此NgModule需要使用、依賴的其他NgModule皆放置於此。
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule
  ],
  // 可以被整個應用程式中的任何部分被使用的 Service 皆放置於此。
  // 也可以將 Service 直接放置在 Component 的 Metadata 裡的 providers
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  // 在此設置的是應用程式通常稱之為Root Component（根元件），而且只有Root Module才要設置此屬性。
  bootstrap: [AppComponent]
})
export class AppModule { }
