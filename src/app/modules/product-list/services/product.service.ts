import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { environment as env } from '../../../../environments/environments';
import {
  Product,
  ProductsResponse,
} from '../../../shared/models/product.interface';
import {
  Category,
  CategoryWithCount,
} from '../../../shared/models/category.interface';
import { CartResponse } from '../../../shared/models/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartItems$ = new BehaviorSubject<number>(0);
  searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {}
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${env.baseUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${env.baseUrl}/products/${id}`);
  }

  searchProduct(query: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${env.baseUrl}/products/search?q=${query}`
    );
  }

  // limited and skip products

  getLimitedProducts(
    limit: number,
    skip: number
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${env.baseUrl}/products?limit=${limit}&skip=${skip}`
    );
  }

  getCategory(): Observable<CategoryWithCount[]> {
    return this.http.get<Category[]>(`${env.baseUrl}/products/categories`).pipe(
      switchMap((categories: Category[]) => {
        const categoryRequests = categories.map((category) =>
          this.http
            .get<{ products: Product[] }>(
              `${env.baseUrl}/products/category/${category.name}`
            )
            .pipe(
              map((response) => ({
                name: category.name,
                count: response.products.length,
              }))
            )
        );

        return forkJoin(categoryRequests);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http
      .get<{ products: Product[] }>(
        `${env.baseUrl}/products/category/${category}`
      )
      .pipe(map((res) => res.products));
  }

  addToCart(): void {
    const items = this.cartItems$.getValue();
    this.cartItems$.next(items + 1);
  }

  getCartItems(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${env.baseUrl}/carts`);
  }
}
