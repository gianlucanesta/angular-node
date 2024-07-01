import { Component, OnInit } from '@angular/core';
import Post from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  storedPosts: Post[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }



  onPostAdded(post: Post) {
    this.storedPosts.push(post);
  }
}
