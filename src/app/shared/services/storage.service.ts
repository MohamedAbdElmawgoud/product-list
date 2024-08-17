import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment as env } from '../../../environments/environments';

Storage.prototype['_setItem'] = Storage.prototype.setItem;

Storage.prototype.setItem = function (key, value) {
  this['_setItem'](
    key,
    CryptoJS.AES.encrypt(value, env.SECRET_STORAGE_KEY).toString()
  );
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  /**
   * Retrieves and decrypts an item from localStorage.
   *
   * @param key The key of the item to retrieve from localStorage.
   * @returns The decrypted item as a string, or null if the item does not exist.
   */
  getItem(key: string): string {
    const item = localStorage.getItem(key);

    if (item) {
      try {
        const decrypted = CryptoJS.AES.decrypt(item, env.SECRET_STORAGE_KEY);
        return decrypted.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error(`Error decrypting item with key ${key}:`, error);
        // Handle the error appropriately
        return '';
      }
    }
    return '';
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
