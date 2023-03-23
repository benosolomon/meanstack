import { Component, Output ,OnInit , EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';
import { mimeType } from './mime-type.validator';


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
  imgPreview:any;
   form: FormGroup;

  constructor(

    private postService: PostService,
    private route: ActivatedRoute) {
      this.form = new FormGroup({
        title: new FormControl(null,{validators: [Validators.required,Validators.minLength(3)]}),
        content: new FormControl(null,{validators: [Validators.required]}),
        image: new FormControl(null,{validators: [Validators.required]})
      });

     }

  ngOnInit(): void {

    this.route.paramMap.subscribe((data: ParamMap) => {
      if(data.has('postId')) {
        this.mode = 'edit';
        this.postId = data.get('postId');
        this.isLoading= true;
        this.posts = this.postService.getPost(this.postId).subscribe((data)=> {
          this.posts = { id:data._id,
            title:data.title,content: data.content,
            imagePath: data.imagePath
          }
          this.form.setValue({
            title: this.posts.title,
            content: this.posts.content,
            image: this.posts.imagePath

          })
        });
        this.isLoading= false;
      } else {
        this.mode = 'create';
      }
    })
  }

  onImagePicker(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    this.form.patchValue({image: file && file[0] ? file[0]:""});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload =() => {
      this.imgPreview = reader && reader.result ? reader.result : "";
    };
    if(file && file[0]) {
reader.readAsDataURL(file[0]);
    }
    }

  onSavePost() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post ={
      title: this.form.value.title,
      content: this.form.value.content
    };
    if(this.mode == 'create'){
      this.postService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);

    } else {
      this.postService.updatePost(
        this.postId,this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }

}
