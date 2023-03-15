import { Component, Output ,OnInit , EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
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

//  @Output() postCreated = new EventEmitter<Post>();
  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  onAddPost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const post ={
      title: form.value.title,
      content: form.value.content
    };
this.postService.addPost(form.value.title,form.value.content);
form.resetForm();
  }

}
