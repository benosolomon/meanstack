import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  isLoading = false;
  posts: Post[] = [];
  postSub: any=  Subscription;
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;
     this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((data: Post[]) => {
        this.posts = data;
        this.isLoading = false;
      })
  }

  onDelete(data: string) {
    if(data) {
      this.postService.deletePost(data);
    }

  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }


}
