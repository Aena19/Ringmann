import { Component,Input } from '@angular/core';
import { Product } from 'src/assets/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {

constructor(private route : ActivatedRoute, private http : HttpClient){}

@Input('product')
url: string = 'assets/data/products.json';
products!: Product[]
product!: Product
productId : number = 0

ngOnInit(){
  this.productId = parseInt(this.route.snapshot.url[1].toString())
  console.log('printing')
  console.log(this.productId)
  console.log("calling func")
  this.getProductsData()
  console.log("finshed func")
  console.log(this.products)
  console.log(this.productId)
  this.product = this.products[this.productId]
  console.log(this.product)
}

getProductsData()
{
  return this.http.get(this.url).subscribe({
    next: (data) => {this.products = data as Product[];console.log("in getproductsdata from pro detail");console.log(this.products)},
    error:(error) => {console.log(error)}
  })    
}

}
