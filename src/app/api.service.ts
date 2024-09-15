import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/posts`).pipe(
      map((posts) => posts),
      catchError((error) => {
        console.error('Error fetching posts:', error);
        return throwError(() => new Error('Error fetching posts'));
      })
    );
  }
}
