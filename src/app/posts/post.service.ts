import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private httpClient: HttpClient) {

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
    this.httpClient.post<{ message: string,postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);

      });

  }
}
