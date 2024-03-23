import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClickService {
  private clicks: number = 0;
  private maxClicks: number = 3;

  constructor(private http: HttpClient) {}

  public getClicks(): number {
    const clicks = parseInt(localStorage.getItem('clicks') || '0');
    this.clicks = clicks;
    return this.clicks;
  }

  public incrementClick(): void {
    if (this.clicks < this.maxClicks) {
      this.clicks++;
      localStorage.setItem('clicks', this.clicks.toString());
    }
  }

  public hasExceededMaxClicks(): boolean {
    return this.clicks >= this.maxClicks;
  }

  public isExpired(): boolean {
    const lastClickTime = parseInt(
      localStorage.getItem('lastClickTime') || '0'
    );
    const expiryTime = 12 * 60 * 60 * 1000; // 12時間
    return Date.now() - lastClickTime > expiryTime;
  }

  public updateLastClickTime(): void {
    localStorage.setItem('lastClickTime', Date.now().toString());
  }
}
