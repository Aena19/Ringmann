import { Component,Input } from '@angular/core';
import { Product } from 'src/assets/models/product.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {

constructor(private route : ActivatedRoute, private http : HttpClient, private router : Router){}

@Input('product')
url: string = 'assets/data/products.json';
products!: Product[]
productId : number = 0

ngOnInit(){
  this.route.paramMap.subscribe((params : ParamMap)=>{
    this.productId = parseInt(params.get('id') || '')
  })
  this.getProductsData()
}

getProductsData()
{
  return this.http.get(this.url).subscribe({
    next: (data) => {this.products = data as Product[];console.log("in getproductsdata from pro detail");console.log(this.products)},
    error:(error) => {console.log(error)}
  })    
}

gotoPrevious(){
  this.router.navigate([('../') + (String(this.productId - 1))],{relativeTo : this.route})
}


gotoNext(){
  this.router.navigate([('../') + (String(this.productId + 1))],{relativeTo : this.route})
}


}
