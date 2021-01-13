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
  members: Member[] = [];
  constructor(private http: HttpClient) { }


 
  getMembers(){
    // of代表建立一個Observable
    if(this.members.length > 0) return of(this.members);
     // request傳到後端的時候會檢查認證，所以要傳一個header，這裡會利用jwt.interceptor.ts來幫助我們
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(map(members => {
      this.members = members;
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
}
