import { Injectable } from '@angular/core';
import Post from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;

        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, postData: FormData) {
    this.http
      .post<{ message: string; post: any }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(
        (responseData) => {
          // console.log('responseData', responseData.post._doc.imagePath);
          const post = {
            id: responseData.post.id,
            title: title,
            content: content,
            imagePath: responseData.post._doc.imagePath,
          };
          console.log('post', post);
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
          this.router.navigate(['/']);
        },
        (error) => {
          // Gestisci gli errori
          console.error('Error adding post:', error);
        }
      );
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: null,
    };
    this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(
      () => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      },
      (error) => {
        console.error('Error deleting post:', error);
      }
    );
  }
}
