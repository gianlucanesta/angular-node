import { Component } from '@angular/core';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoading = false;

  onLogin(form: NgForm) {
    console.log('form', form.value);
  }
}
