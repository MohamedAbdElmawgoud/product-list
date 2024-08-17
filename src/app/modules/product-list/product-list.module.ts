import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductsComponent } from './products/products.component';
import { CardComponent } from '../../shared/components/card/card.component';

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, ProductListRoutingModule, CardComponent],
})
export class ProductListModule {}
