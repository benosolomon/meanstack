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
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(
    private router: Router,
    private httpClient: HttpClient) {

  }

  getPosts() {
    this.httpClient.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((data: { title: any; content: any; _id: any; }) => {
          return {
            title: data.title,
            content: data.content,
            id: data._id
          };
        });
      }))
      .subscribe((transformPost) => {
        this.posts = transformPost;
        this.postsUpdated.next([...this.posts]);
      })
  }

  deletePost(postId: string) {
    this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe((data) => {
        console.log("Post Deleted");
        const updatedPosts = this.posts.filter(post => post.id != postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: 'null', title: title, content: content };
    this.httpClient.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string,title:string,content: string}>("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content
    };
    this.httpClient.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe((res) => {
        console.log(res);
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p => p.id == post.id);
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }
}
