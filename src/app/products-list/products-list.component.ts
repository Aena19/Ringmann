import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/assets/models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent {

  url: string = 'assets/data/pro.json';
  products !: Product[] ;
  type : string = '';
  productId : number = 0;

  constructor(private http: HttpClient, private route : ActivatedRoute) {}

  ngOnInit() {
    console.log("calling func")
    this.getProductsData()
    console.log("finshed func")
    console.log(this.products)
      console.log("printing")
      console.log(this.route.snapshot.url.length)
      if (this.route.snapshot.url.length == 1)
          this.type = "all" 
      else
          this.type = "single"
    // console.log(this.type)
    // console.log("pid " + this.route.snapshot.url[1])
    // console.log(this.route.snapshot.url[1].toString())
    // this.productId = parseInt(this.route.snapshot.url[1].toString())
    // console.log("pro")
    // console.log(this.products[this.productId])
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {this.products = data as Product[]; console.log("in getproductsdata from pro list"); console.log(this.products)},
      error:(error) => {console.log(error)}
    })    
  }
}
