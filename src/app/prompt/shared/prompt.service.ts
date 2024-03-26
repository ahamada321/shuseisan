import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prompt } from './prompt.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PromptService {
  constructor(private http: HttpClient) {}

  public postPrompt(promptData: Prompt): Observable<any> {
    return this.http.post('/api/v1/prompts', promptData);
  }
}
