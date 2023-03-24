import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  postSub: any = Subscription;
  totolPosts = 0;
  currentPage = 1;
  postPerPage = 2;
  pageSizeOption = [1, 2, 5, 10];
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, 1);
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData:  {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totolPosts = postData.postCount;
        this.isLoading = false;
      })
  }

  onChangePage(event: PageEvent) {
    if (event) {
      this.isLoading = true;
      this.currentPage = event.pageIndex + 1;
      this.postPerPage = event.pageSize;
      this.postService.getPosts(this.postPerPage, this.currentPage);

    }
  }

  onDelete(data: string) {
    if (data) {
      this.isLoading = true;
      this.postService.deletePost(data).subscribe(()=> {
        this.postService.getPosts(this.postPerPage,this.currentPage);
      });
    }

  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }


}
