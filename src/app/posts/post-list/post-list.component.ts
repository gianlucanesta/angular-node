import { PostsService } from '../posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import Post from '../post.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  isLoading = false;
  totalPosts = 10;
  postPerPage = 5;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub!: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();

    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
        console.log('posts: ', posts);
      });
  }

  onChangedPage(pageData: PageEvent) {
    console.log('pageData', pageData);
    // this.isLoading = true;
    // this.postsService.getPosts(pageData.pageIndex + 1, pageData.pageSize);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
