import { Component, Output ,OnInit , EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent="";
    mode = 'create';
   postId: any;
   posts: any;
   isLoading = false;

  constructor(

    private postService: PostService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data: ParamMap) => {
      if(data.has('postId')) {
        this.mode = 'edit';
        this.postId = data.get('postId');
        this.isLoading= true;
        this.posts = this.postService.getPost(this.postId).subscribe((data)=> {
          this.posts = { id:data._id, title:data.title,content: data.content}
        });
        this.isLoading= false;
      } else {
        this.mode = 'create';
      }
    })
  }

  onSavePost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    const post ={
      title: form.value.title,
      content: form.value.content
    };
    if(this.mode == 'create'){
      this.postService.addPost(form.value.title,form.value.content);

    } else {
      this.postService.updatePost(this.postId,form.value.title,form.value.content);
    }
    form.resetForm();
  }

}
