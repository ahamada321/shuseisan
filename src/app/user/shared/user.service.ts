import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  public getUserById(userId: any): Observable<any> {
    return this.http.get('/api/v1/users/' + userId);
  }

  public updateUser(userId: any, userData: any): Observable<any> {
    return this.http.patch('/api/v1/users/' + userId, userData);
  }

  public getBookmarks(): Observable<any> {
    return this.http.get('/api/v1/users/bookmark');
  }

  public addBookmark(promptId: any): Observable<any> {
    return this.http.get('/api/v1/users/bookmark/' + promptId);
  }

  public getHistories(): Observable<any> {
    return this.http.get('/api/v1/users/history');
  }

  public addHistory(promptId: any): Observable<any> {
    return this.http.get('/api/v1/users/history/' + promptId);
  }

  public deleteBookmark(promptId: any): Observable<any> {
    return this.http.delete('/api/v1/users/bookmark/' + promptId);
  }
}
