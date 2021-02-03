import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  // services在app關閉之前都會存在，所以很適合將查詢過構的資料先存在這裡。
  // 這樣在擷取資料的時候，就不必每次都呼叫一次API。
  // 但是由於資料已經存在了，以此例如這裡有人註冊的時候，就必須要更新members，否則不會有變化直到重啟app。
  members: Member[] = [];

  // 如果是要儲存key, value，最好是使用Map
  memberCache = new Map();

  user :User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>{
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }
 
  getUSerParams(){
    return this.userParams;
  }

  setUserParams(userParams: UserParams){
    this.userParams = userParams;
  }


  reSetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams){

    // 檢查查詢的紀錄，如果查過一樣的條件，就不再去呼叫API，而是抓取快取檔。
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize, userParams.minAge, userParams.maxAge, userParams.gender, userParams.orderBy);

    // 想得到 HTTP 狀態碼、HTTP 回應標頭之類的資訊，就要特別加入 options 參數。
    // 這裡我們要抓的東西是response的body，並且運用params去做篩選
    return this.getPaginationResult<Member[]>(this.baseUrl + 'users', params).pipe(map(response => {

      // 查詢結束過後，將查詢的結果儲存至暫存資料裡面，以供下次查詢時判斷。
      // values回傳一個陣列
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }))
  }

  private getPaginationResult<T>(url: string, params: HttpParams) {

    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        // member array會塞在body
        paginatedResult.result = response.body;

        // 取得由API提供的Header
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
    }));
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number, minAge: number, maxAge: number, gender: string, orderBy: string){

    // HttpParams可以序列化我們的QueryString
    let params = new HttpParams();

    // 因為是要傳QueryString，所以要toString
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('minAge', minAge.toString());
    params = params.append('maxAge', maxAge.toString());
    params = params.append('gender', gender.toString());
    params = params.append('orderBy', orderBy);

    return params;
  }

  getMember(username: string){

    console.log(this.memberCache);

    // 對於不同條件的篩選來說，有可能會有很多重複的資料儲存在快取裡面。
    // 因此這裡將memberCache的陣列，使用reduce()將每一個元素進行concat合併的動作，使其成為單一陣列，並且其初始值為[]。
    // 然後使用find去尋找第一個符合的元素。
    const member = [...this.memberCache.values()].reduce((array, element) => array.concat(element.result), []).find((member: Member) => member.userName === username);

    console.log(member);

    if(member){
      return of(member);
    }

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
