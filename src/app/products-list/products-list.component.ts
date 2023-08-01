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
  inputproduct : Product[] = [new Product(),new Product()]
  constructor(private http: HttpClient, private route : ActivatedRoute) {}
  productsToBeDisplayedCount : number = 0

  @HostListener('document:click', ['$event'])
  clickout(event : Event) {
    console.log(event)
    // if(document.getElementById("price")?.getAttribute('open')==='')
    //   document.getElementById("price")?.removeAttribute('open')
    // if(document.getElementById("flange")?.getAttribute('open')==='')
    //   document.getElementById("flange")?.removeAttribute('open')
    // if(document.getElementById("size")?.getAttribute('open')==='')
    //   document.getElementById("size")?.removeAttribute('open')
  }

  ngOnInit() {
    console.log('ngoninit...ProductsListComponent')
    this.getProductsData()
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {this.products = data as Product[]; this.getFilterValues('load')},
      error:(error) => {console.log(error)}
    })    
    //this.products = (<any>Object).assign(new Product(),Products)
  }

  getFilterValues(filterValueString : string){
    console.log("getFilterValues")
    var tempProduct : Product[]

    if(filterValueString === 'load')
    {
      this.productsToBeDisplayed = this.products
    }
    else{
      this.filterValueArray = []
      this.productsToBeDisplayed = []
      if(filterValueString != '')
        this.filterValueArray = filterValueString.split(",")
      
      var filterValue : number = 0
    
      for(let i = 0; i < this.filterValueArray.length; i++){
        filterValue = parseInt(this.filterValueArray[i])
        tempProduct = this.products.filter(product => product.id === filterValue)
        for(let i = 0; i < tempProduct.length; i++){
                  this.productsToBeDisplayed.push(tempProduct[i])
        }
      }
    }
    this.productsToBeDisplayedCount = this.productsToBeDisplayed.length
    this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => p1.id - p2.id)
  }

  uniqueFilter(value : Product, index : number, self : Product[]) {
    return self.indexOf(value) === index;
  }  

  sortProducts(sortOption:number){
    if(sortOption == 1){
      this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => p1.id - p2.id)
    }
    else if(sortOption == 2){
      
      this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => {
        if (p1.name > p2.name) {
            return 1;
        }
        if (p1.name < p2.name) {
            return -1;
        }
        return 0;
        }
        )
    }
    else if(sortOption == 3){
      
      this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => {
        if (p2.name > p1.name) {
            return 1;
        }
        if (p2.name < p1.name) {
            return -1;
        }
        return 0;
        }
        )
    }
    else if(sortOption == 4){
      
      this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => p1.price - p2.price)
    }
    else if(sortOption == 5){
      
      this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => p2.price - p1.price)
    }

  }
}
