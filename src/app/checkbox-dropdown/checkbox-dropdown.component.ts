import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Product } from 'src/assets/models/product.model';
import * as Products from 'src/assets/data/products.json'
import { HttpClient } from '@angular/common/http';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-checkbox-dropdown',
  templateUrl: './checkbox-dropdown.component.html',
  styleUrls: ['./checkbox-dropdown.component.css']
})
export class CheckboxDropDownComponent {

  @Input() filterType : string = ''
  @Input() checkedValues : string[] = []
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
  priceRange : string[] = ["0-50","51-100","101-150","151-200","201-250","251-300"]
  productsToBeDisplayed! : Product[]
  label : string = "label"
  @Input() detailclickCounter : number = 100

  constructor(private http: HttpClient) {}
 
  ngOnInit(){
    this.getProductsData()
  }

  detailClicked(){
    // console.log(this.detailclickCounter)
    // console.log(this.inputProduct)
    // if(this.detailclickCounter == 0){
    //   console.log('in detailclicked..in if')
    //     if(this.filterName === 'Price')
    //     {
    //       this.selectedPriceValues = this.checkedValues
    //       this.getPriceValues(1)
    //     }
    //     else 
        // if(this.filterName === 'Flange')
        // {
        //   this.selectedFlangeValues = this.checkedValues
        //   this.getFlangeValues(1)
        // }
    //     else if(this.filterName === 'Size(idxfdxh)')
    //     {
    //       this.selectedSizeValues = this.checkedValues
    //       this.getSizeValues(1)
    //     }
    //   this.detailclickCounter++
    // }
    // else
    //   console.log('detail clicked else block')
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {this.products = data as Product[]
        if(this.filterName === "Flange"){
          this.getFlangeValues(0) 
          this.id = "flange"
        }
        if(this.filterName === "Size(idxfdxh)"){
          this.getSizeValues(0)
          this.id = "size"
        }
        if(this.filterName === "Price"){
          this.getPriceValues(0)
          this.id = "price"
        }
      
      },
      error:(error) => {console.log(error)}
    }) 
  }

  getPriceValues(mode:number){
    var tempProducts : Product[]
    for(let i = 0; i < this.priceRange.length; i++){
      var tempcheckboxArray = this.priceRange[i].split('-')
      var minPrice = parseInt(tempcheckboxArray[0])
      var maxPrice = parseInt(tempcheckboxArray[1]) 

      tempProducts = this.inputProduct.filter(product => product.price >= minPrice).filter(product => product.price <= maxPrice)

      var priceRange : string = this.priceRange[i]
      var count : number = tempProducts.length

      this.checkboxArrayPrice[0][i] = priceRange + ' (' + count + ')'

      if(mode ==0){
        for(let i = 0;i<this.checkboxArrayPrice[0].length;i++)
        {
          this.checkboxArrayPrice[1][i]= false
        }
      }
      else{
        for(let i = 0;i<this.checkboxArrayPrice[0].length;i++)
        {
          for(let j =0; j < this.selectedPriceValues.length; i++){
            if(this.checkboxArrayPrice[0][i] === this.selectedPriceValues[i])
            this.checkboxArrayPrice[1][i]= true
          }
          
        }
      }
    }
  }


  getFlangeValues(mode:number){
    this.flangeValues = []
    console.log('in getflangevalues with mode = ' + mode)
    console.log(this.inputProduct)
    if(this.inputProduct != undefined){
      for(let i = 0; i < this.inputProduct.length; i++){
        if(this.inputProduct[i].flange != null){
          for(let j = 0; j < this.inputProduct[i].flange.length; j++){
              this.flangeValues.push(this.inputProduct[i].flange[j])
          }
        }
      }
    }
    // else
    // {
    //   for(let i = 0; i < this.products.length; i++){
    //     if(this.products[i].flange != null){
    //       for(let j = 0; j < this.products[i].flange.length; j++){
    //           this.flangeValues.push(this.products[i].flange[j])
    //       }
    //     }
    //   }
    // }

    this.flangeValues = this.flangeValues.sort()
    this.checkboxArrayFlange[0] = this.flangeValues.filter(this.uniqueFilter)

    for (let i = 0; i < this.checkboxArrayFlange[0].length; i++){
      var flange : string = this.checkboxArrayFlange[0][i]
      var count : number = this.getCount(flange,"Flange")
      this.checkboxArrayFlange[0][i] = flange + " (" + count + ")" 

    }

    if(mode === 0){
      for(let i = 0;i<this.checkboxArrayFlange[0].length;i++)
      {
        this.checkboxArrayFlange[1][i]= false
      }
    }
    else{
      for(let i = 0;i<this.checkboxArrayFlange[0].length;i++)
      {
        for(let j =0; j < this.selectedFlangeValues.length; i++){
          if(this.checkboxArrayFlange[0][i] === this.selectedFlangeValues[i])
          this.checkboxArrayFlange[1][i]= true
        }
        
      }
    }

    console.log(this.checkboxArrayFlange)
  }

  getCount(key: string, filterName : string) {
    if(filterName === "Flange")
      return this.flangeValues.filter((curElem) =>curElem === key).length
    else if(filterName === "Size(idxfdxh)")
      return this.sizeValues.filter((curElem) => curElem === key).length
    else
      return 0
  }

  getSizeValues(mode:number){
    this.sizeValues = []
    console.log('in getsizevalues with mode = ' + mode)
    if(this.inputProduct != undefined){
      for(let i = 0; i < this.inputProduct.length; i++){
        if(this.inputProduct[i].size != null){
          for(let j = 0; j < this.inputProduct[i].size.length; j++){
              this.sizeValues.push(this.inputProduct[i].size[j])
          }
        }
      }
    }
    // else
    // {
    //   for(let i = 0; i < this.products.length; i++){
    //     if(this.products[i].size != null){
    //       for(let j = 0; j < this.products[i].size.length; j++){
    //           this.sizeValues.push(this.products[i].size[j])
    //       }
    //     }
    //   }
    // }
    this.sizeValues = this.sizeValues.sort()
    this.checkboxArraySize[0] = this.sizeValues.filter(this.uniqueFilter)

    for (let i = 0; i < this.checkboxArraySize[0].length; i++){
      var size : string = this.checkboxArraySize[0][i]
      var count : number = this.getCount(size,"Size(idxfdxh)")
      this.checkboxArraySize[0][i] = size + " (" + count + ")" 

    }
    if(mode === 0){
      for(let i = 0;i<this.checkboxArraySize[0].length;i++)
      {
        this.checkboxArraySize[1][i]= false
      }
    }
    else{
      for(let i = 0;i<this.checkboxArraySize[0].length;i++)
      {
        for(let j =0; j < this.selectedSizeValues.length; i++){
          if(this.checkboxArraySize[0][i] === this.selectedSizeValues[i])
          this.checkboxArraySize[1][i]= true
        }
      }
    }

    console.log(this.checkboxArrayFlange)
  }

  uniqueFilter(value : string, index : number, self : string[]) {
    return self.indexOf(value) === index;
  }

  filterValueChanged(){

    var finalProductList : Product[] = []
    var tempProduct : Product[] = []

    if(this.filterName === "Price"){
      this.getSelectedPriceValues()
      this.selectedPriceCount = this.selectedPriceValues.length
      this.filterValueChangeEvent.emit(this.selectedPriceValues.toString() + ',' + this.filterName)
    }
    else if(this.filterName === "Flange"){
      this.getSelectedFlangeValues()
      this.selectedFlangeCount = this.selectedFlangeValues.length
      this.filterValueChangeEvent.emit(this.selectedFlangeValues.toString() + ',' + this.filterName)
    }
    else if(this.filterName === "Size(idxfdxh)"){
      this.getSelectedSizeValues()
      this.selectedSizeCount = this.selectedSizeValues.length
      this.filterValueChangeEvent.emit(this.selectedSizeValues.toString() + ',' + this.filterName)
    }
  }

  getSelectedPriceValues(){
    this.selectedPriceValues = []
      for(let j = 0; j < this.checkboxArrayPrice[0].length; j++){
        if(this.checkboxArrayPrice[1][j] == true){
          this.selectedPriceValues.push(this.checkboxArrayPrice[0][j])
          }
      }
    }

  getSelectedFlangeValues(){
    this.selectedFlangeValues = []
    for(let j = 0; j < this.checkboxArrayFlange[0].length; j++){
      if(this.checkboxArrayFlange[1][j] == true){
        this.selectedFlangeValues.push(this.checkboxArrayFlange[0][j])
        }
    }
  }

  getSelectedSizeValues(){
    this.selectedSizeValues = []
    for(let j = 0; j < this.checkboxArraySize[0].length; j++){
      if(this.checkboxArraySize[1][j] == true){
        this.selectedSizeValues.push(this.checkboxArraySize[0][j])
        }
    }
  }

  filterProductsByPrice(){
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
