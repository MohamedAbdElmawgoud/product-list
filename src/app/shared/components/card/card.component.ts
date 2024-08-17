import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class CardComponent {
  @Input() product!: Product;
  @Output() addToCart: EventEmitter<Product> = new EventEmitter<Product>();

  addToCartHandler() {
    this.addToCart.emit(this.product);
  }
}
