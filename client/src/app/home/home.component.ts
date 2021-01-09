import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  carouselInterval: number = 3000;
  registerMode: boolean = true;
  favors: any;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getFavors();
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean){
    this.registerMode = !event;
  }

  getFavors(){
    this.http.get<any>('https://localhost:5001/api/account/GetFavor').subscribe(response=>
    this.favors = response);
  }
}
