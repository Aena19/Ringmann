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
  id:string = ""
  selectedPriceValues : string[] = []
  selectedFlangeValues : string[] = []
  selectedSizeValues : string[] = []
  selectedPriceCount : number = 0
  selectedFlangeCount : number = 0
  selectedSizeCount : number = 0
  priceRange : string[] = ["0-50","51-100","101-150","151-200","201-250","251-300"]
  flangeList !: string[]
  sizeList !: string[]
  productsToBeDisplayed! : Product[]
  label : string = "label"
  @Input() detailclickCounter !: number 

  constructor(private http: HttpClient) {}
 
  ngOnInit(){

    const details = document.querySelectorAll("details");

    details.forEach(targetDetail => {
      targetDetail.addEventListener("toggle", (event) => {
        console.log(targetDetail)
        
        if (targetDetail.open) {
          console.log('targetdetail open')
          

        } else {
          console.log('targetdetail close')
         this.detailclickCounter = 0
        }
      });

    }

    )
    

    this.getProductsData()
  }

  detailClicked(){
    console.log('detailClicked')
    console.log(this.checkedValues)
    console.log(this.detailclickCounter)
    console.log(this.inputProduct)
    if(this.detailclickCounter == 0){
      console.log('in detailclicked..in if')
        if(this.filterName === 'Price')
        {
          this.selectedPriceValues = this.checkedValues
          this.getPriceValues(1)
        }
        else 
        if(this.filterName === 'Flange')
        {
          this.selectedFlangeValues = this.checkedValues
          this.updateFlangeValues(1)
        }
        else if(this.filterName === 'Size(idxfdxh)')
        {
          this.selectedSizeValues = this.checkedValues
          this.updateSizeValues(1)
        }
      this.detailclickCounter++
    }
    else
      console.log('detail clicked else block')
  }

  getProductsData()
  {
    return this.http.get(this.url).subscribe({
      next: (data) => {this.products = data as Product[]
        if(this.filterName === "Flange"){
          this.getFlangeValues() 
          this.updateFlangeValues(0)
          this.id = "flange"
        }
        if(this.filterName === "Size(idxfdxh)"){
          this.getSizeValues()
          this.updateSizeValues(0)
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
    console.log('in getpricevalues with mode = '+mode)
    var tempProducts : Product[]
console.log(this.inputProduct)
console.log(this.selectedPriceValues)
    for(let i = 0; i < this.priceRange.length; i++){
      console.log('in for')
      var tempcheckboxArray = this.priceRange[i].split('-')
      var minPrice = parseInt(tempcheckboxArray[0])
      var maxPrice = parseInt(tempcheckboxArray[1]) 

      tempProducts = this.inputProduct.filter(product => product.price >= minPrice).filter(product => product.price <= maxPrice)

      var priceRange : string = this.priceRange[i]
      var count : number = tempProducts.length

      this.checkboxArrayPrice[0][i] = priceRange + ' (' + count + ')'
console.log(this.checkboxArrayPrice[0][i])
      if(mode ==0 || this.selectedPriceValues.length === 0){
        for(let i = 0;i<this.checkboxArrayPrice[0].length;i++)
        {
          this.checkboxArrayPrice[1][i]= false
        }
      }
      else{
        console.log(this.checkboxArrayPrice[0].length)
        console.log(this.selectedPriceValues.length)
        for(let i = 0;i<this.checkboxArrayPrice[0].length;i++)
        {
          for(let j =0; j < this.selectedPriceValues.length; j++){
            if(this.checkboxArrayPrice[0][i] === this.selectedPriceValues[j]){
              this.checkboxArrayPrice[1][i]= true
              break
            }
            else
              this.checkboxArrayPrice[1][i]= false
          }
          
        }
      }
    }
    console.log(this.checkboxArrayPrice)
    this.selectedPriceCount = this.selectedPriceValues.length
  }


  getFlangeValues(){
    this.flangeValues = []
    console.log('in getflangevalues with mode = ')
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
    this.flangeList = this.flangeValues.filter(this.uniqueFilter)
  }

  updateFlangeValues(mode : number){
    this.checkboxArrayFlange = [[],[]]
    this.flangeValues = []

    console.log('updateFlangeValues with mode = ' + mode)

    for(let i = 0; i < this.inputProduct.length; i++){
      if(this.inputProduct[i].flange != null){
        for(let j = 0; j < this.inputProduct[i].flange.length; j++){
            this.flangeValues.push(this.inputProduct[i].flange[j])
        }
      }
    }

    for (let i = 0; i < this.flangeList.length; i++){
      var flange : string = this.flangeList[i]
      var count : number = this.getCount(flange,"Flange")
      this.checkboxArrayFlange[0][i] = flange + " (" + count + ")" 

    }
console.log(this.selectedFlangeValues)
    if(mode === 0 || this.selectedFlangeValues.length === 0){
      for(let i = 0;i<this.checkboxArrayFlange[0].length;i++)
      {
        this.checkboxArrayFlange[1][i]= false
      }
    }
    else{
      for(let i = 0;i<this.checkboxArrayFlange[0].length;i++)
      {
        for(let j =0; j < this.selectedFlangeValues.length; j++){
          if(this.checkboxArrayFlange[0][i] === this.selectedFlangeValues[j]){
            this.checkboxArrayFlange[1][i]= true
            break
          }
          else
          this.checkboxArrayFlange[1][i]= false
        }
        
      }
    }
    this.selectedFlangeCount = this.selectedFlangeValues.length
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

  uniqueFilter(value : string, index : number, self : string[]) {
    return self.indexOf(value) === index;
  }

  getSizeValues(){
    this.sizeValues = []
    console.log('in getSizevalues with mode = ')
    console.log(this.inputProduct)
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
    this.sizeList = this.sizeValues.filter(this.uniqueFilter)
  }

  updateSizeValues(mode : number){
    this.checkboxArraySize = [[],[]]
    this.sizeValues = []

    console.log('updatesizeValues with mode = ' + mode)

    for(let i = 0; i < this.inputProduct.length; i++){
      if(this.inputProduct[i].size != null){
        for(let j = 0; j < this.inputProduct[i].size.length; j++){
            this.sizeValues.push(this.inputProduct[i].size[j])
        }
      }
    }

    for (let i = 0; i < this.sizeList.length; i++){
      var size : string = this.sizeList[i]
      var count : number = this.getCount(size,"Size(idxfdxh)")
      this.checkboxArraySize[0][i] = size + " (" + count + ")" 

    }
console.log(this.selectedSizeValues.length)
    if(mode === 0 || this.selectedSizeValues.length === 0){
      for(let i = 0;i<this.checkboxArraySize[0].length;i++)
      {
        this.checkboxArraySize[1][i]= false
      }
    }
    else{
      for(let i = 0;i<this.checkboxArraySize[0].length;i++)
      {
        for(let j =0; j < this.selectedSizeValues.length; j++){
          var checkboxValue = this.checkboxArraySize[0][i].substring(0,this.checkboxArraySize[0][i].length - 4)
          var selectedValue = this.selectedSizeValues[j].substring(0,this.selectedSizeValues[j].length - 4)
          if(checkboxValue === selectedValue)
          {
            this.checkboxArraySize[1][i]= true
            break
          }
          else
            this.checkboxArraySize[1][i]= false
        }
        
      }
    }
    this.selectedSizeCount = this.selectedSizeValues.length
    console.log(this.checkboxArraySize)
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

  // updateFlangeValues(inputProduct : Product[]){
  //   var filterValue : string
  //   var count : number

  //   for(let i = 0; i > -1; i++){
  //     if(document.getElementById("flange"+i) != null){
  //       filterValue = document.getElementById("labelflange"+i)!.innerHTML.substring(1,document.getElementById("labelflange"+i)!.innerHTML.length-5)
  //       count = inputProduct.filter(product => product.flange).filter(product => product.flange.toString().includes(filterValue)).length
  //       document.getElementById("labelflange"+i)!.innerHTML = ' ' + filterValue + " (" + count + ") "
  //     }
  //     else
  //       break
  //   }
  // }
  
  // updateSizeValues(inputProduct : Product[]){
  //   var filterValue : string
  //   var count : number

  //   for(let i = 0; i > -1; i++){
  //     if(document.getElementById("size"+i) != null){
  //       filterValue = document.getElementById("labelsize"+i)!.innerHTML.substring(1,document.getElementById("labelsize"+i)!.innerHTML.length-5)
  //       count = inputProduct.filter(product => product.size).filter(product => product.size.toString().includes(filterValue)).length
  //       document.getElementById("labelsize"+i)!.innerHTML = ' ' + filterValue + " (" + count + ") "
  //     }
  //     else
  //       break
  //   }
  // }

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
