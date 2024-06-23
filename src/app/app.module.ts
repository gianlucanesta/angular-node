import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, PostCreateComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatCard,
    MatButtonModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
