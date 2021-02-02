import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;

  // services在app關閉之前都會存在，所以很適合將查詢過構的資料先存在這裡。
  // 這樣在擷取資料的時候，就不必每次都呼叫一次API。
  // 但是由於資料已經存在了，以此例如這裡有人註冊的時候，就必須要更新members，否則不會有變化直到重啟app。
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient) { }
 
  getMembers(page?: number, itemPerPage?: number){

    // HttpParams可以序列化我們的QueryString
    let params = new HttpParams();

    if(params !== null && itemPerPage !== null){
      // 因為是要傳QueryString，所以要toString
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemPerPage.toString());
    }

    // 想得到 HTTP 狀態碼、HTTP 回應標頭之類的資訊，就要特別加入 options 參數。
    // 這裡我們要抓的東西是response的body，並且運用params去做篩選
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(response => {
        // member array會塞在body
        this.paginatedResult.result = response.body;

        // 取得由API提供的Header
        if(response.headers.get('Pagination') !== null){
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
        }
      return this.paginatedResult;
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
