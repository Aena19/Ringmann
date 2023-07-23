import { Component, Input } from '@angular/core';
import { Product } from 'src/assets/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

@Input() product! : Product;
@Input() type! : string

}
