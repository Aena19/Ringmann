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
filter !: string 
selectedProductIds !: string
firstProductId : number = 0
lastProductId : number = 0
selectedProductsArray : string[] = []

ngOnInit(){
  this.route.paramMap.subscribe((params : ParamMap)=>{
    this.productId = parseInt(params.get('id') || '')
    console.log(this.productId)
    this.filter = (params.get('filter') || '')
    console.log(this.filter)
    console.log(params)
    this.selectedProductIds = (params.get('selectedIds') || '')
    console.log(this.selectedProductIds)
  })
  this.getProductsData()
  this.selectedProductsArray = this.selectedProductIds.split(',')
  this.firstProductId = parseInt(this.selectedProductsArray[0])
  this.lastProductId = parseInt(this.selectedProductsArray[this.selectedProductsArray.length-1])
  
}

getPreviousId(){
  var prevId, curId
  for(let i = 0; i < this.selectedProductsArray.length; i++){
    curId = parseInt(this.selectedProductsArray[i])
    if(this.productId === curId){
      prevId = this.selectedProductsArray[i-1]
      break
    }
  }
  return prevId
}

getNextId(){
  var nextId, curId
  for(let i = 0; i < this.selectedProductsArray.length; i++){
    curId = parseInt(this.selectedProductsArray[i])
    if(this.productId === curId){
      nextId = this.selectedProductsArray[i+1]
      break
    }
  }
  return nextId
}

getProductsData()
{
  return this.http.get(this.url).subscribe({
    next: (data) => {this.products = data as Product[];console.log("in getproductsdata from pro detail");console.log(this.products)},
    error:(error) => {console.log(error)}
  })    
}

gotoPrevious(){
  
  this.router.navigate([('../../../') + (String(this.getPreviousId())) + '/' + this.filter + '/' + this.selectedProductIds],{relativeTo : this.route})
}


gotoNext(){
  this.router.navigate([('../../../') + (String(this.getNextId())) + '/' + this.filter + '/' + this.selectedProductIds],{relativeTo : this.route})
}

goBackToProducts(){
  this.router.navigate([('../../../') + (this.filter)],{relativeTo : this.route})
}
}
