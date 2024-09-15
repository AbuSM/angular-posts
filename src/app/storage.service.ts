import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    const result = localStorage.getItem(key);
    if (!result) {
      return null;
    }
    try {
      return JSON.parse(result);
    } catch (e) {
      return;
    }
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
