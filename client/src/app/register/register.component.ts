import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  // 輸入屬性，通常為接收數據資料，也就是就是讓Parent將資料傳送到Child中使用。寫在Child裡面。
  @Input() usersFromHomeComponent: any = {};
  // 輸出屬性，通常提供事件給外部呼叫回傳使用，也就是讓Child將資料傳回Parent中使用。寫在Child裡面。
  @Output() cancelRegister = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  register(){
    console.log(this.model)
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
