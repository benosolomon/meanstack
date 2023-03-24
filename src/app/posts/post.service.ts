import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUpdated = new Subject<{posts: Post[],postCount: number}>();
  private posts: Post[] = [];

  constructor(
    private router: Router,
    private httpClient: HttpClient) {

  }

  getPosts(postperPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postperPage}&page=${currentPage}`;
    this.httpClient.get<{ message: string, posts: any, maxPost: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((data: { title: any; content: any; _id: any; imagePath: any }) => {
            return {
              title: data.title,
              content: data.content,
              id: data._id,
              imagePath: data.imagePath
            };
          }), maxPost: postData.maxPost
        }
      }))
      .subscribe((transformPostData) => {
        this.posts = transformPostData.posts;
        this.postsUpdated.next({posts: [...this.posts],postCount: transformPostData.maxPost});
      })
  }

  deletePost(postId: string) {
    return this.httpClient.delete("http://localhost:3000/api/posts/" + postId);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts',
      postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });

  }

  getPost(id: string) {
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string }>("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let post: any;
    if (typeof (image) == 'object') {
      post = new FormData();
      post.append("id", id);
      post.append("title", title);
      post.append("content", content);
      post.append("image", image, title);
    } else {
      post = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.httpClient.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe((res) => {
        this.router.navigate(["/"]);
      })
  }
}
