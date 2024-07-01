import { Component } from '@angular/core';

import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoading = false;

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {
    console.log('form', form.value);

    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
