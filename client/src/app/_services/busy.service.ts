import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  busy(){
    this.busyRequestCount++;
    // 第一個參數是spinner name, 第二個參數是Configuration
    this.spinnerService.show(undefined, {
      type: "square-jelly-box",
      bdColor: "rgba(0,0,0,0.7)",
      color: "#fff"
    });
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0){
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
