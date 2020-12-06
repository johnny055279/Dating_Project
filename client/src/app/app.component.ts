import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = '阿姨我不想努力了';

  // any代表任何型態，較不安全。
  users:any;

  // dependency injection, make http request to API
  constructor(private http: HttpClient){}

  //實作OnInit給AppComponent用，呼叫API，
  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    // 要加上subscribe會驅動
    this.http.get('https://localhost:5001/api/users').subscribe(
      response => {this.users = response;},
      error => {console.log(error)}
    )
  }
}
