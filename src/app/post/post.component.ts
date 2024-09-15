import { Component, Input } from '@angular/core';
import { Post } from './post.interface';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  @Input() post: Post | null = null;
}
