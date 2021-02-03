import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { strings as stringsTW } from 'ngx-timeago/language-strings/zh-TW';
import { TimeagoIntl } from 'ngx-timeago';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  member!: Member;
  // 使用ActivatedRoute介面，就可以在Routing時將參數帶入。
  constructor(private membersService:MembersService, private route: ActivatedRoute, private intl: TimeagoIntl) {
    intl.strings = stringsTW;
    intl.changes.next();
   }

  ngOnInit(): void {

    this.loadMember();

    this.galleryOptions = [{
      width: '500px',
      height:'500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }]
  }

  getImages():NgxGalleryImage[]{
    let imageUrls = [];
    for (let photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }


  loadMember(){
    this.membersService.getMember(this.route.snapshot.paramMap.get('username') || '{}').subscribe(member=> {
      this.member = member;
      // JS 不會等一個做完再做下一個，所以如果擺在ngOnInit，會出現loadMember還沒做完就做getImages，會造成屬性Undefined。
      this.galleryImages = this.getImages();
    });
  }

}
