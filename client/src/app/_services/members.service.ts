import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;

  // services在app關閉之前都會存在，所以很適合將查詢過構的資料先存在這裡。
  // 這樣在擷取資料的時候，就不必每次都呼叫一次API。
  // 但是由於資料已經存在了，以此例如這裡有人註冊的時候，就必須要更新members，否則不會有變化直到重啟app。
  members: Member[] = [];
  constructor(private http: HttpClient) { }


 
  getMembers(){
    // of代表建立一個Observable
    if(this.members.length > 0) return of(this.members);
     // request傳到後端的時候會檢查認證，所以要傳一個header，這裡會利用jwt.interceptor.ts來幫助我們
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(map(members => {
      this.members = members;
      console.log(members);
      return members;
    }))
  }

  getMember(username: string){
    const member = this.members.find(n=>n.userName === username);
    // find 找不到的時候是return undefine
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number){
    // 因為是put request，我們沒有需要在body家東西，因此給空值就好。
    return this.http.put(this.baseUrl + 'users/setMainPhoto/' + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/deletePhoto/' + photoId, {});
  }

}
