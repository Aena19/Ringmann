import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/assets/models/product.model';
import * as Products from 'src/assets/data/products.json'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkbox-dropdown',
  templateUrl: './checkbox-dropdown.component.html',
  styleUrls: ['./checkbox-dropdown.component.css']
})
export class CheckboxDropDownComponent {

  @Input() filterType : string = ""
  @Input() filterName : string = ""
  @Input() inputProduct : Product [] = []

  @Output() filterValueChangeEvent = new EventEmitter<string>

  url: string = 'assets/data/products.json';
  products!: Product[]
  flangeValues : string[] = []
  sizeValues : string[] = []
  //checkboxArray :string[][]= [[],[]]
  checkboxArrayPrice : [string[],boolean[]] = [[],[]]
  checkboxArrayFlange : [string[],boolean[]] = [[],[]]
  checkboxArraySize : [string[],boolean[]] = [[],[]]
  id:string=""
  selectedPriceValues : string[] =[]
  selectedFlangeValues : string[] =[]
  selectedSizeValues : string[] =[]
  selectedPriceCount : number = 0
  selectedFlangeCount : number = 0
  selectedSizeCount : number = 0
  priceRange : string[] = ["0-50","50-100","100-150","150-200","200-250","250-300"]
  productsToBeDisplayed! : Product[]
  label : string = "label"
  constructor(private http: HttpClient) {}
  
  ngOnInit(){
    this.getProductsData()
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {this.products = data as Product[]
        if(this.filterName === "Flange"){
          this.getFlangeValues() 
          this.id = "flange"
        }
        if(this.filterName === "Size(idxfdxh)"){
          this.getSizeValues()
          this.id = "size"
        }
        if(this.filterName === "Price"){
          this.getPriceValues()
          this.id = "price"
        }
      
      },
      error:(error) => {console.log(error)}
    }) 
  }

  getPriceValues(){
    console.log('in getPriceValues')
    console.log(document.getElementById('labelprice0'))
    var tempProducts : Product[]
    this.checkboxArrayPrice[0] = this.priceRange
    for(let i = 0; i < this.checkboxArrayPrice[0].length; i++){
      var tempcheckboxArray = this.checkboxArrayPrice[0][i].split('-')
      var minPrice = parseInt(tempcheckboxArray[0])
      var maxPrice = parseInt(tempcheckboxArray[1]) 

      tempProducts = this.products.filter(product => product.price > minPrice).filter(product => product.price < maxPrice)

      var priceRange : string = this.checkboxArrayPrice[0][i]
      var count : number = tempProducts.length

      this.checkboxArrayPrice[0][i] = priceRange + ' (' + count + ')'

      for(let i = 0;i<this.checkboxArrayPrice[0].length;i++)
      {
        this.checkboxArrayPrice[1][i]= false
      }
    }
  }


  getFlangeValues(){
    this.flangeValues = []
    
      for(let i = 0; i < this.products.length; i++){
        if(this.products[i].flange != null){
          for(let j = 0; j < this.products[i].flange.length; j++){
              this.flangeValues.push(this.products[i].flange[j])
          }
        }
      }
 
    
    this.checkboxArrayFlange[0] = this.flangeValues.filter(this.uniqueFilter)

    for (let i = 0; i < this.checkboxArrayFlange[0].length; i++){
      var flange : string = this.checkboxArrayFlange[0][i]
      var count : number = this.getCount(flange,"Flange")
//console.log(flange)
      this.checkboxArrayFlange[0][i] = this.flangeValues[i] + " (" + count + ")" 

    }
    for(let i = 0;i<this.checkboxArrayFlange[0].length;i++)
    {
      this.checkboxArrayFlange[1][i]= false
    }
  }

  getCount(key: string, filterName : string) {
    if(filterName === "Flange")
      return this.flangeValues.filter((curElem) =>curElem === key).length
    else if(filterName === "Size(idxfdxh)")
      return this.sizeValues.filter((curElem) => curElem === key).length
    else
      return 0
  }

  getSizeValues() {
    this.sizeValues = []
    
      for(let i = 0; i < this.products.length; i++){
        if(this.products[i].size != null){
          for(let j = 0; j < this.products[i].size.length; j++){
              this.sizeValues.push(this.products[i].size[j])
          }
        }
      }
    this.checkboxArraySize[0] = this.sizeValues.filter(this.uniqueFilter)
    for (let i = 0; i < this.checkboxArraySize[0].length; i++){
      var size : string = this.checkboxArraySize[0][i]
      var count : number = this.getCount(size, 'Size(idxfdxh)')

      this.checkboxArraySize[0][i] = size + " (" + count + ")" 

    }
    for(let i = 0;i<this.checkboxArraySize[0].length;i++)
    {
      this.checkboxArraySize[1][i]= false
    }
  }

  uniqueFilter(value : string, index : number, self : string[]) {
    return self.indexOf(value) === index;
  }

  filterValueChanged(){

    var finalProductList : Product[]
    console.log('in filterValueChanged')

    this.getSelectedPriceValues()
    this.getSelectedFlangeValues()
    this.getSelectedSizeValues()
    

    this.selectedPriceCount = this.selectedPriceValues.length
    this.selectedFlangeCount = this.selectedFlangeValues.length
    this.selectedSizeCount = this.selectedSizeValues.length
   
  // console.log(this.productsToBeDisplayed)
  if(this.selectedPriceCount === 0 && this.selectedFlangeCount === 0 && this.selectedSizeCount === 0 )
    finalProductList = this.products
  else
    finalProductList = this.filterProducts()
    console.log(finalProductList)
    if(this.filterName === 'Price'){
      this.updateFlangeValues(finalProductList)
      this.updateSizeValues(finalProductList)
    }
    else if(this.filterName === 'Flange'){
     this.updatePriceValues(finalProductList)
     this.updateSizeValues(finalProductList)
    }
    else if(this.filterName === 'Size(idxfdxh)'){
      this.updateFlangeValues(finalProductList)
      this.updatePriceValues(finalProductList)
    }
    var selectedProductIds : number[] = []
    console.log('finalProductList')
    for (let i = 0; i<=finalProductList.length - 1; i++){
      selectedProductIds.push(finalProductList[i].id)
    }
    console.log(selectedProductIds.toString())
    this.filterValueChangeEvent.emit(selectedProductIds.toString())
  }

  getSelectedPriceValues(){
    console.log('in getSelectedPriceValues')
    this.selectedPriceValues = []
    if(this.checkboxArrayPrice[0].length != 0){
      console.log('in if')
      for(let j = 0; j < this.checkboxArrayPrice[0].length; j++){
        if(this.checkboxArrayPrice[1][j] == true){
          this.selectedPriceValues.push(this.checkboxArrayPrice[0][j])
          }
      }
    }
    else{
      console.log('in else')
      for(let i = 0; i > -1; i++){
        console.log(document.getElementById("price"+i))
        if(document.getElementById("price"+i) != null){
            if(document.getElementById("price"+i)!.getAttribute('ng-reflect-model') === "true"){
              this.selectedPriceValues.push(document.getElementById("labelprice"+i)!.innerHTML.substring(1,document.getElementById("labelprice"+i)!.innerHTML.length-1))
          } 
        }
        else
          break
      }
    }
    console.log(this.selectedPriceValues)

  }

  getSelectedFlangeValues(){
    console.log('in getSelectedFlangeValues')
    this.selectedFlangeValues = []
    if(this.checkboxArrayFlange[0].length != 0){
      for(let j = 0; j < this.checkboxArrayFlange[0].length; j++){
        if(this.checkboxArrayFlange[1][j] == true){
          this.selectedFlangeValues.push(this.checkboxArrayFlange[0][j])
          }
      }
    }
    else{
      for(let i = 0; i > -1; i++){
        if(document.getElementById("flange"+i) != null){
            if(document.getElementById("flange"+i)!.getAttribute('ng-reflect-model') === "true"){
              this.selectedFlangeValues.push(document.getElementById("labelflange"+i)!.innerHTML.substring(1,document.getElementById("labelflange"+i)!.innerHTML.length-1))
          } 
        }
        else
          break
      }
    }
    console.log(this.selectedFlangeValues)
  }

  getSelectedSizeValues(){
    console.log('in getSelectedSizeValues')
    this.selectedSizeValues = []
    if(this.checkboxArraySize[0].length != 0){
      for(let j = 0; j < this.checkboxArraySize[0].length; j++){
        if(this.checkboxArraySize[1][j] == true){
          this.selectedSizeValues.push(this.checkboxArraySize[0][j])
          }
      }
    }
    else{
      for(let i = 0; i > -1; i++){
        if(document.getElementById("size"+i) != null){
            if(document.getElementById("size"+i)!.getAttribute('ng-reflect-model') === "true"){
              this.selectedSizeValues.push(document.getElementById("labelsize"+i)!.innerHTML.substring(1,document.getElementById("labelsize"+i)!.innerHTML.length-1))
          } 
        }
        else
          break
      }
    }
    console.log(this.selectedSizeValues)
  }

  filterProductsByPrice(){
    console.log('in filterProductsByPrice')
    var filterValue :string
    var tempProduct : Product[] = []
    var finalProduct : Product[] = []
  //  console.log(this.productsToBeDisplayed)
    for(let i = 0 ; i < this.selectedPriceValues.length; i++){
      filterValue = this.selectedPriceValues[i].substring(0,this.selectedPriceValues[i].length)
      var tempfilterValueArray = filterValue.split('-')
      var minPrice = parseInt(tempfilterValueArray[0])
      var maxPrice = parseInt(tempfilterValueArray[1])

      tempProduct = this.products.filter(product => product.price > minPrice).filter(product => product.price < maxPrice)

      for(let i = 0; i < tempProduct.length; i++){
        finalProduct.push(tempProduct[i])
      }
    }
    console.log('finishing filterProductsByPrice')
    //console.log(this.productsToBeDisplayed)
    if(this.selectedPriceValues.length === 0)
      return this.products
    else
      return finalProduct
  }

  filterProductsByFlange(inputProduct : Product[]){
    console.log('in filterProductsByFlange')
    var filterValue :string
    var tempProduct : Product[] = []
    var finalProduct : Product[] = []

    for(let i = 0 ; i < this.selectedFlangeValues.length; i++){

      filterValue = this.selectedFlangeValues[i].substring(0,this.selectedFlangeValues[i].length-4)

      tempProduct = inputProduct.filter(product => product.flange).filter(product => product.flange.toString().includes(filterValue))

      for(let i = 0; i < tempProduct.length; i++){
        finalProduct.push(tempProduct[i])
      }
      
    }
    console.log('finishing filterProductsByFlange')
    //console.log(this.productsToBeDisplayed)
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

  filterProducts(){
    console.log('filterProducts')
    var tempproduct : Product[]
    tempproduct = this.filterProductsByPrice()
   // console.log('after filterProductsByPrice')
   // console.log(tempproduct)
    tempproduct = this.filterProductsByFlange(tempproduct)
    //console.log('after filterProductsByFlange')
    //console.log(tempproduct)
    tempproduct = this.filterProductsBySize(tempproduct)
    //console.log('after filterProductsBySize')
    //console.log(tempproduct)
    tempproduct = tempproduct.filter(this.uniqueFilterProduct)
    console.log(tempproduct)

    return tempproduct 
  }

  updatePriceValues(inputProduct : Product[]){
    var filterValue : string
    var count : number

    for(let i = 0; i > -1; i++){
      
      if(document.getElementById("price"+i) != null){

        filterValue = document.getElementById("labelprice"+i)!.innerHTML.substring(1,document.getElementById("labelprice"+i)!.innerHTML.length-5)

        var tempfilterValueArray = filterValue.split('-')
        var minPrice = parseInt(tempfilterValueArray[0])
        var maxPrice = parseInt(tempfilterValueArray[1])

        count = inputProduct.filter(product => product.price > minPrice).filter(product => product.price < maxPrice).length
        document.getElementById("labelprice"+i)!.innerHTML = ' ' + filterValue + " (" + count + ") "
       // this.checkboxArrayPrice[0][i] = filterValue + " (" + count + ")"
      }
      else
        break
    }


  }

  updateFlangeValues(inputProduct : Product[]){
    var filterValue : string
    var count : number

    for(let i = 0; i > -1; i++){
      if(document.getElementById("flange"+i) != null){
        filterValue = document.getElementById("labelflange"+i)!.innerHTML.substring(1,document.getElementById("labelflange"+i)!.innerHTML.length-5)
        count = inputProduct.filter(product => product.flange).filter(product => product.flange.toString().includes(filterValue)).length
        document.getElementById("labelflange"+i)!.innerHTML = ' ' + filterValue + " (" + count + ") "
      }
      else
        break
    }
  }
  
  updateSizeValues(inputProduct : Product[]){
    var filterValue : string
    var count : number

    for(let i = 0; i > -1; i++){
      if(document.getElementById("size"+i) != null){
        filterValue = document.getElementById("labelsize"+i)!.innerHTML.substring(1,document.getElementById("labelsize"+i)!.innerHTML.length-5)
        count = inputProduct.filter(product => product.size).filter(product => product.size.toString().includes(filterValue)).length
        document.getElementById("labelsize"+i)!.innerHTML = ' ' + filterValue + " (" + count + ") "
      }
      else
        break
    }
  }

  getTrueCount(value : boolean){
    return value
  }

  uniqueFilterProduct(value : Product, index : number, self : Product[]) {
    return self.indexOf(value) === index;
  }  

  reset(){
    if(this.filterName === 'Price'){
      for(let i = 0; i < this.checkboxArrayPrice[1].length; i++){
        this.checkboxArrayPrice[1][i] = false
      }

    }
    else if (this.filterName === 'Flange'){
      for(let i = 0; i < this.checkboxArrayFlange[1].length; i++){
        this.checkboxArrayFlange[1][i] = false
      }

    }
    else if (this.filterName === 'Size(idxfdxh)'){
      for(let i = 0; i < this.checkboxArraySize[1].length; i++){
        this.checkboxArraySize[1][i] = false
      }
    }
    this.filterValueChanged()
  }

}
