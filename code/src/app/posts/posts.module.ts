/**
 * Consists of of the Post Components Imports which are declared
 * for use in app.module.ts
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    CommonModule, // unlock ngIf
    RouterModule, // unlock RouterLink
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
})
export class PostsModule {}
