import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginationHeaders, getPaginationResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getMessages(pageNum, pageSize, container){
    let params = getPaginationHeaders(pageNum, pageSize);

    params = params.append('Container', container);
    return getPaginationResult<Message[]>(this.baseUrl+'message', params, this.http);
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + username);
  }

  sendMessage(username: string, content: string){
    // 如果屬性跟值名稱一樣，可以不用寫冒號而直接帶入。
    return this.http.post<Message>(this.baseUrl + 'message', {RecipientUsername: username, Content: content})
  }

  deleteMessage(id: number){
    return  this.http.delete(this.baseUrl + 'message/' + id);
  }
}
