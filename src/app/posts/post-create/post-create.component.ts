import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import Post from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  mode: string = 'create';
  postId!: string | null;
  post!: Post;
  form!: FormGroup;
  isLoading: boolean = false;
  imagePreview: string = '';

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId || '').subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
          };

          // Inizializza il form con i valori del post
          this.form.patchValue({
            title: this.post.title,
            content: this.post.content,
          });

          // Mostra l'anteprima dell'immagine se presente
          if (this.post.imagePath) {
            this.imagePreview = this.post.imagePath;
          }
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    const title = this.form.value.title;
    const content = this.form.value.content;
    const image = this.form.value.image;

    const postData = new FormData();
    postData.append('id', this.postId || '');
    postData.append('title', title);
    postData.append('content', content);
    // console.log('image istanceof', image instanceof File);

    postData.append('image', image, image.name);

    if (this.mode === 'create') {
      this.postsService.addPost(title, content, postData);
      // console.log('addPost');
    } else {
      let image: File | string = this.post.imagePath!;
      if (this.form.value.image) {
        image = this.form.value.image;
      }
      this.postsService.updatePost(this.postId!, title, content, image);
      console.log('image', image);
      // console.log('updatePost');
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
