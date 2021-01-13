import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-memeber-edit',
  templateUrl: './memeber-edit.component.html',
  styleUrls: ['./memeber-edit.component.css']
})
export class MemeberEditComponent implements OnInit {
  @ViewChild("editForm") editForm!: NgForm;
  member!: Member;
  user!: User;

  // 監控使用者瀏覽器，避免直接關閉或輸入網址跳轉造成資料未儲存。
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountService, 
    private memberService: MembersService, 
    private toastr: ToastrService) { 
    // 因為currentUser$是Observiable，不能直接對其作業，所以要再這裡先把它拉出來。
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
    })
  }

  updateMember(){
    // 不會回傳資料，所以用()
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastr.success("資料儲存成功!!")
      // 在前端顯示編輯後的結果(假的，還是要從API撈資料最好，不然重整就不見了)
      this.editForm.reset(this.member);
    })
  }
}
