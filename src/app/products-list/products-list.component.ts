import { Component, HostListener, ViewChildren, QueryList, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/assets/models/product.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as Products from 'src/assets/data/products.json'
import { query } from '@angular/animations';
import { CheckboxDropDownComponent } from '../checkbox-dropdown/checkbox-dropdown.component';

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
  allSelectedFilters !: string
  selectedPriceValues : string[] =[]
  selectedFlangeValues : string[] =[]
  selectedSizeValues : string[] =[]
  selectedFlangeArray : string[] = []
  filter !: string 
  detailclickCounter : number = 0
selectedProductIds : number[] = []
  ngOnInit() {  
    document.addEventListener('click', function(e) {
      const details = document.querySelectorAll("details");
      details.forEach(f => {e.target instanceof Node && !f.contains(e.target) ? f.removeAttribute('open') : ''});
    })
    
    this.route.paramMap.subscribe((params : ParamMap)=>{
      this.filter = (params.get('filter') || '').replaceAll('^','/')
      console.log(this.filter)
    })

    
    this.getProductsData()
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {
          this.products = data as Product[]; 
          if(this.filter === '')
            this.getFilterValues('load');
          else{
            var splitFilterArray = this.filter.split(';')
            console.log(splitFilterArray)
            for(let i = 0; i < splitFilterArray.length - 1; i++){
              console.log(splitFilterArray[i])
              this.getFilterValues(splitFilterArray[i])
            }
          }
        },
      error:(error) => {console.log(error)}
    })      
  }

  getFilterValues(filterValueString : string){
    console.log("getFilterValues")
    console.log('this.productsToBeDisplayed...' + filterValueString)

    var tempProduct : Product[]
    var filterName : string =''

    if(filterValueString === 'load')
    {
      this.productsToBeDisplayed = this.products
    }
    else{
      this.filterValueArray = []
      this.productsToBeDisplayed = []
      if(filterValueString != '')
      {
        if(filterValueString.startsWith(','))
          filterValueString = filterValueString.substring(1,filterValueString.length)
           this.filterValueArray = filterValueString.split(",")
      }
      if(this.filterValueArray.length != 0)
        filterName = this.filterValueArray.pop() ?? ''
      
      if(filterName === 'Price'){
          this.selectedPriceValues = this.filterValueArray
      }

      else if(filterName === 'Flange'){
        this.selectedFlangeValues = this.filterValueArray
      }
      else if(filterName === 'Size(idxfdxh)'){
        this.selectedSizeValues = this.filterValueArray
      }
      this.productsToBeDisplayed = this.filterProductsByPrice()
      console.log('applied price filter')
      console.log(this.productsToBeDisplayed)
      this.productsToBeDisplayed = this.filterProductsByFlange(this.productsToBeDisplayed)
      console.log('applied flange filter')
      console.log(this.productsToBeDisplayed)
      this.productsToBeDisplayed = this.filterProductsBySize(this.productsToBeDisplayed)
      console.log('applied size filter')
      console.log(this.productsToBeDisplayed)
      
      var filterValue : number = 0
    }
    
    this.productsToBeDisplayed = this.productsToBeDisplayed.filter(this.uniqueFilterProduct)
    this.productsToBeDisplayed = this.productsToBeDisplayed.sort((p1,p2) => p1.id - p2.id)
    this.productsToBeDisplayedCount = this.productsToBeDisplayed.length
    this.selectedProductIds.length = 0
    for(let i = 0; i < this.productsToBeDisplayedCount; i++){
      this.selectedProductIds.push(this.productsToBeDisplayed[i].id)
    }
    console.log(this.productsToBeDisplayed)
    console.log('ending getfiltervalues productslist')
  }

  uniqueFilterProduct(value : Product, index : number, self : Product[]) {
    return self.indexOf(value) === index;
  } 

  filterProductsByFlange(inputProduct : Product[]){
    console.log('in filterProductsByFlange')
    console.log('input')
    console.log(inputProduct)
    var filterValue :string
    var tempProduct : Product[] = []
    var finalProduct : Product[] = []
console.log(this.selectedFlangeValues)
    for(let i = 0 ; i < this.selectedFlangeValues.length; i++){

      filterValue = this.selectedFlangeValues[i].substring(0,this.selectedFlangeValues[i].length-4)
console.log(filterValue)
      tempProduct = inputProduct.filter(product => product.flange).filter(product => product.flange.toString().includes(filterValue))
      console.log(tempProduct)
      for(let i = 0; i < tempProduct.length; i++){
        finalProduct.push(tempProduct[i])
      }
      
    }
    console.log('finishing filterProductsByFlange')
    //console.log(this.productsToBeDisplayed)
    console.log(finalProduct)
    if(this.selectedFlangeValues.length === 0)
      return inputProduct
    else
      return finalProduct
  }

  filterProductsBySize(inputProduct : Product[]){
    console.log('in filterProductsBySize')
    var filterValue :string
    var tempProduct : Product[] = []
    var finalProduct : Product[] = []
    
    for(let i = 0 ; i < this.selectedSizeValues.length; i++){
     
      filterValue = this.selectedSizeValues[i].substring(0,this.selectedSizeValues[i].length-4)

      tempProduct = inputProduct.filter(product => product.size).filter(product => product.size.toString().includes(filterValue))

      for(let i = 0; i < tempProduct.length; i++){
        finalProduct.push(tempProduct[i])
      }
      
    }
    console.log('finishing filterProductsBysize')
    //console.log(this.productsToBeDisplayed)
    if(this.selectedSizeValues.length === 0)
      return inputProduct
    else
      return finalProduct
  }

  
  filterProductsByPrice(){
    console.log('in filterProductsByPrice')
    var filterValue :string
    var   tempProduct : Product[] = []
    var finalProduct : Product[] = []
  //  console.log(this.productsToBeDisplayed)
  console.log(this.selectedPriceValues)
    for(let i = 0 ; i < this.selectedPriceValues.length; i++){
      filterValue = this.selectedPriceValues[i].substring(0,this.selectedPriceValues[i].length - 4)
console.log(filterValue)
      var tempfilterValueArray = filterValue.split('-')
      var minPrice = parseInt(tempfilterValueArray[0])
      var maxPrice = parseInt(tempfilterValueArray[1])

      tempProduct = this.products.filter(product => product.price > minPrice).filter(product => product.price < maxPrice)

      for(let i = 0; i < tempProduct.length; i++){
        finalProduct.push(tempProduct[i])
      }
    }
    console.log('finishing filterProductsByPrice')
    console.log(finalProduct)
    if(this.selectedPriceValues.length === 0)
      return this.products
    else
      return finalProduct
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

  removeAllFilters(){
    console.log('removeAllFilters')
    this.selectedFlangeValues.length = 0
    this.selectedPriceValues.length = 0
    this.selectedSizeValues.length = 0
    this.getFilterValues('load')
  }

  removeFilter(value : string, filterName : string){
    console.log(filterName + '...' + value)
    console.log(this.selectedSizeValues)
    value = value.substring(0,value.length -4)
    if(filterName === 'Price'){
      for(let i = 0; i < this.selectedPriceValues.length; i++){
        var price : string = this.selectedPriceValues[i].substring(0,this.selectedPriceValues[i].length - 4)
        if(price === value){
          this.selectedPriceValues.splice(i,1)
        }
        this.getFilterValues(this.selectedPriceValues.toString() + ',' + this.filterName)
      }
    }
    else if(filterName === 'Flange'){
      for(let i = 0; i < this.selectedFlangeValues.length; i++){
        var flange : string = this.selectedFlangeValues[i].substring(0,this.selectedFlangeValues[i].length - 4)
        if(flange === value){
          this.selectedFlangeValues.splice(i,1)
        }
        this.getFilterValues(this.selectedFlangeValues.toString() + ',' + this.filterName)
      }
    }
    else if(filterName === 'Size(idxfdxh)'){
      for(let i = 0; i < this.selectedSizeValues.length; i++){
        var size : string = this.selectedSizeValues[i].substring(0,this.selectedSizeValues[i].length - 4)
        console.log(size)
        console.log(value)
        if(size === value){
          this.selectedSizeValues.splice(i,1)
          break
        }
      }
      this.getFilterValues(this.selectedSizeValues.toString() + ',' + this.filterName)
    }
  }
}
