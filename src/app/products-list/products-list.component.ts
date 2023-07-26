import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/assets/models/product.model';
import { ActivatedRoute } from '@angular/router';
import * as Products from 'src/assets/data/products.json'

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent {

  url: string = 'assets/data/products.json';
  products !: Product[] ;
  productsToBeDisplayed !: Product[] ;
  type : string = '';
  productId : number = 0;
  filterValueArray : string[] = []
  filterValue : string = ""
  filterType : string = ""
  
  constructor(private http: HttpClient, private route : ActivatedRoute) {}

  ngOnInit() {
    this.getProductsData()
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {this.products = data as Product[]; this.getFilterValues('')},
      error:(error) => {console.log(error)}
    })    
    //this.products = (<any>Object).assign(new Product(),Products)
  }

  getFilterValues(filterValueString : string){
    if(filterValueString != ''){
      if(filterValueString.length > 2)
        this.filterValueArray = filterValueString.substring(0,filterValueString.length-2).split(",")
      if(filterValueString.length === 2)
        filterValueString = ""
      this.filterType = filterValueString.substring(filterValueString.length-1,filterValueString.length)
    }
    
    if(filterValueString === '')
    {
      this.productsToBeDisplayed = this.products
    }
    else{
    
    for(let i = 0 ; i < this.filterValueArray.length; i++){
      this.filterValue = this.filterValueArray[i].substring(0,this.filterValueArray[i].length-4)
      if(this.filterType === "F")
        this.productsToBeDisplayed = this.products.filter(product => product.flange).filter(product => product.flange.toString().includes(this.filterValue))
      else
      this.productsToBeDisplayed = this.products.filter(product => product.size).filter(product => product.size.toString().includes(this.filterValue))
    }
   
  }
  }

  
}
