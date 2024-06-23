import { Injectable } from '@angular/core';
import Post from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  constructor() {}

  getPosts() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title,
      content,
    };
    this.posts.push(post);
  }
}
