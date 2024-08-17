import { Component } from '@angular/core';
import { ProductService } from '../../../modules/product-list/services/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CartResponse } from '../../models/cart.interface';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  numberOfAddedItems: number = 0;
  searchTerm: string = '';
  searchSubjectPrivate = new Subject<string>();
  token!: string;

  constructor(
    private productService: ProductService,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getToken();
    this.subscribeCartItems();
    this.getCartItems();
    this.initSerach();
    this.subscribeOnRouteChange();
  }

  subscribeOnRouteChange() {
    this.router.events.subscribe(() => {
      this.getToken();
    });
  }

  getCartItems(): void {
    this.productService.getCartItems().subscribe((cart: CartResponse) => {
      this.productService.cartItems$.next(cart.total);
    });
  }

  subscribeCartItems() {
    this.productService.cartItems$.subscribe((items) => {
      this.numberOfAddedItems = items;
    });
  }

  initSerach() {
    this.searchSubjectPrivate
      .pipe(
        debounceTime(300), // Wait for 300ms of pause in typing
        distinctUntilChanged() // Ignore if the search term is the same as the previous one
      )
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm); // Call the search function
      });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubjectPrivate.next(searchTerm); // Emit the value into the subject
  }

  performSearch(searchTerm: string): void {
    this.productService.searchSubject.next(searchTerm); // Emit the search term to the parent component
  }

  getToken() {
    this.token = this.storage.getItem('token');
  }
}
