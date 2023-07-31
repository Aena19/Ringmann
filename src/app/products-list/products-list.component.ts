import { Component, HostListener } from '@angular/core';
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
  filterName : string = ""

  constructor(private http: HttpClient, private route : ActivatedRoute) {}

  @HostListener('document:click', ['$event'])
  clickout(event : Event) {
    console.log(event)
    //document.getElementById()
  }

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
    console.log("getFilterValues")
    var tempProduct : Product[]

    if(filterValueString != '')
      this.filterValueArray = filterValueString.split(",")

    if(this.filterValueArray.length > 0)
    {
      this.filterName= this.filterValueArray[this.filterValueArray.length-1]
      this.filterValueArray.pop()
      if(this.filterValueArray[0] === '')
        filterValueString = ""
    }
    
    // if(filterValueString != ''){
    //   if(filterValueString.length > 2)
    //     this.filterValueArray = filterValueString.substring(0,filterValueString.length-2).split(",")
    //   if(filterValueString.length === 2)
    //     filterValueString = ""
    //   this.filterType = filterValueString.substring(filterValueString.length-1,filterValueString.length)
    // }
    
    if(filterValueString === '')
    {
      this.productsToBeDisplayed = this.products
    }
    else{
      this.productsToBeDisplayed =[]
      for(let i = 0 ; i < this.filterValueArray.length; i++){
        this.filterValue = this.filterValueArray[i].substring(0,this.filterValueArray[i].length-4)
        if(this.filterName === "Flange")
          tempProduct = this.products.filter(product => product.flange).filter(product => product.flange.toString().includes(this.filterValue))
        else if(this.filterName === "Size(idxfdxh)")
          tempProduct = this.products.filter(product => product.size).filter(product => product.size.toString().includes(this.filterValue))
        else if(this.filterName === "Price"){
          var tempfilterValueArray = this.filterValueArray[i].split('-')
          var minPrice = parseInt(tempfilterValueArray[0])
          var maxPrice = parseInt(tempfilterValueArray[1])
  
          console.log(minPrice + '  ' + maxPrice)
  
          tempProduct = this.products.filter(product => product.price > minPrice).filter(product => product.price < maxPrice)
        }
        else 
          tempProduct = []
        for(let i = 0; i < tempProduct.length; i++){
          this.productsToBeDisplayed.push(tempProduct[i])
        }
      }
      this.productsToBeDisplayed = this.productsToBeDisplayed.filter(this.uniqueFilter)
    }
    console.log(this.productsToBeDisplayed)
  }

  uniqueFilter(value : Product, index : number, self : Product[]) {
    return self.indexOf(value) === index;
  }  
}
