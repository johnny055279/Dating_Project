import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { MembersService } from './members.service';

// 可使此服務注入到其他的服務或是組件中
@Injectable({
  // 服務會一直存在直到app關閉或dispose，也就是singleton
  providedIn: 'root'
})
export class AccountService {

  // make a request to API
  baseurl = environment.apiUrl;

  // create a Observable object
  // Observable物件內先寫好整個資料流的流程，以便未來訂閱 (subscribe) 時可以依照這資料流程進行處理。
  // Subject 是在產生物件後才決定資料的流向。
  // ReplaySubject 當有一個新的訂閱者註冊時，可以重新回放最後幾個事件資料。
  // 這裡存放一筆User資料就好。
  private currentUserSource = new ReplaySubject<User>(1);
  // Observable物件的變數名最後面+上$
  currentUser$ = this.currentUserSource.asObservable();
  user!: User;

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post<User>(this.baseurl + 'account/login', model).pipe(
      // 從定義的interface接資料，不再是使用any。
      // 在post已經定義資料型態後，其實這裡就已經知道response是User型態了，不用在指定也沒關係。
      map((user: User) =>{
        if(user){
         this.setCurrentUser(user);
      }
    }))
  }

  // 建立Helper
  setCurrentUser(user: User){
    // 將使用者資訊存在localStorage，可以當作session使用。
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
  }

  register(model: any){
    return this.http.post<any>(this.baseurl + 'account/register', model).pipe(
      map(user=>{
        localStorage.setItem('user', JSON.stringify(user));

        this.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
      })
    )
  }
}
