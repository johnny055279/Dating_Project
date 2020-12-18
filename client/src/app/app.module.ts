import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// To Use Http Client, need to add it after the BrowserModule!!
import{ HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  // 屬於此NgModule的Component、Directive與Pipe皆放置於此。
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent
  ],

  // 此NgModule需要使用、依賴的其他NgModule皆放置於此。
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    CollapseModule.forRoot()
  ],
  // 可以被整個應用程式中的任何部分被使用的 Service 皆放置於此。
  // 也可以將 Service 直接放置在 Component 的 Metadata 裡的 providers
  providers: [],
  // 在此設置的是應用程式通常稱之為Root Component（根元件），而且只有Root Module才要設置此屬性。
  bootstrap: [AppComponent]
})
export class AppModule { }
