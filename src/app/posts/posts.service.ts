import { environment } from './../../../environment/environment';
import { Injectable } from '@angular/core';
import Post from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&currentPage=${currentPage}`;

    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          console.log('postData', postData);
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        console.log('transformedPostsData:', transformedPostsData);

        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
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
      creator: string;
    }>(BACKEND_URL + '/' + id);
  }

  addPost(title: string, content: string, postData: FormData) {
    this.http
      .post<{ message: string; post: any }>(BACKEND_URL, postData)
      .subscribe(
        (responseData) => {
          this.router.navigate(['/']);
        },
        (error) => {
          // Gestisci gli errori
          console.error('Error adding post:', error);
        }
      );
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, image.name);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + '/' + id, postData).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);

        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + '/' + postId);
  }
}
