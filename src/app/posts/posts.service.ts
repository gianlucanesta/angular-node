import { Injectable } from '@angular/core';
import Post from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

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
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;

        this.postsUpdated.next([...this.posts]);
      });
  }

  // getPosts(): Observable<Post[]> {
  //   return this.http
  //     .get<{ message: string; posts: Post[] }>(
  //       'http://localhost:3000/api/posts'
  //     )
  //     .pipe(
  //       map((postData) => postData.posts),
  //       tap((posts) => {
  //         this.posts = posts;
  //         this.postsUpdated.next([...this.posts]);
  //       })
  //     );
  // }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  nextId = 0;

  addPost(title: string, content: string) {
    const post: Post = {
      id: (++this.nextId).toString(),
      title,
      content,
    };

    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
