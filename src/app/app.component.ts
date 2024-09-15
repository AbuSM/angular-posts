import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ApiService } from './api.service';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Post } from './post/post.interface';
import { StorageService } from './storage.service';
import { SEARCH_QUERY } from '../constants';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-posts';
  fetchedPosts: Post[] = [];
  dataSource = new MatTableDataSource<Post>();
  displayedColumns = ['id', 'userId', 'title'];
  subscriptions = new Subscription();
  searchForm: FormGroup;

  constructor(
    private readonly apiService: ApiService,
    private readonly storageService: StorageService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.apiService.getPosts().subscribe((posts) => {
        this.fetchedPosts = posts;
        this.dataSource.data = posts;
      })
    );
    this.subscriptions.add(
      this.searchForm
        .get('search')
        ?.valueChanges.pipe(
          debounceTime(500),
          switchMap((value) => this.filterPosts(value))
        )
        .subscribe(() => {})
    );
    const searchQuery = this.storageService.getItem(SEARCH_QUERY);
    if (searchQuery) {
      this.searchForm.setValue({
        search: searchQuery,
      });
      this.filterPosts(searchQuery);
    }
  }

  filterPosts(value: string) {
    if (!value) {
      this.dataSource.data = this.fetchedPosts;
      return this.fetchedPosts;
    }
    const result = this.dataSource.data.filter((post: Post) => {
      return post.title.includes(value);
    });
    this.dataSource.data = result;
    return result;
  }

  onSubmit() {
    console.log('Query saved');
    if (!this.searchForm.value.search) {
      this.storageService.removeItem(SEARCH_QUERY);
      return;
    }
    this.storageService.setItem(SEARCH_QUERY, this.searchForm.value.search);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
