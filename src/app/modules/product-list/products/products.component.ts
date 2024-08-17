import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import {
  Product,
  ProductsResponse,
} from '../../../shared/models/product.interface';
import { CategoryWithCount } from '../../../shared/models/category.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products: Product[] = [];
  categories: CategoryWithCount[] = [];
  limit = 8;
  skip = 0;
  totalProducts = 0; // Total number of products
  currentPage = 1; // Current page number
  totalPages = 0; // Total number of pages
  selectedCategory: string = 'All';
  pages: (number | string)[] = [1];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
    this.getCategories();
    this.getSearchProduct();
  }

  getProducts() {
    this.productService.getLimitedProducts(this.limit, this.skip).subscribe({
      next: (res: ProductsResponse) => {
        this.products = res.products;
        this.totalProducts = res.total;
        this.totalPages = Math.ceil(this.totalProducts / this.limit);
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Product loading complete');
      },
    });
  }

  getCategories() {
    this.productService.getCategory().subscribe({
      next: (res: CategoryWithCount[]) => {
        this.categories = res;
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Category loading complete');
      },
    });
  }

  onCategoryChange(event: Event): void {
    const selectedCategory = (event.target as HTMLInputElement).value;
    this.selectedCategory = selectedCategory;

    if (selectedCategory === 'All') {
      // Fetch all products if 'All' category is selected
      this.getProducts();
    } else {
      // Fetch products by the selected category
      this.productService.getProductsByCategory(selectedCategory).subscribe({
        next: (products) => {
          this.products = products;
          // const totalProducts = products.length;
          // this.totalPages = Math.ceil(totalProducts / this.limit);
          // this.updatePagination();
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
  }

  addToCart(): void {
    this.productService.addToCart();
  }

  getSearchProduct(): void {
    this.productService.searchSubject.subscribe((searchTerm) => {
      if (searchTerm.trim() === '') {
        // If search term is empty, call getProducts to load all products
        this.getProducts();
      } else {
        // Otherwise, perform the search
        this.productService.searchProduct(searchTerm).subscribe({
          next: (res: ProductsResponse) => {
            this.products = res.products;
            // this.totalProducts = res.total;
            // this.totalPages = Math.ceil(this.totalProducts / this.limit);
            this.updatePagination();
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
      }
    });
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.skip = (this.currentPage - 1) * this.limit;
      this.getProducts();
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.skip = (this.currentPage - 1) * this.limit;
      this.getProducts();
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.skip = (this.currentPage - 1) * this.limit;
      this.getProducts();
      this.updatePagination();
    }
  }

  updatePagination(): void {
    this.pages = [];

    if (this.totalPages <= 5) {
      // If there are 5 or fewer pages, show them all
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Always show the first page
      this.pages.push(1);

      // Add the ellipsis if currentPage > 3
      if (this.currentPage > 3) {
        this.pages.push('...');
      }

      // Show pages around the current page
      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }

      // Add the ellipsis if currentPage < totalPages - 2
      if (this.currentPage < this.totalPages - 2) {
        this.pages.push('...');
      }

      // Always show the last page
      this.pages.push(this.totalPages);
    }
  }
}
