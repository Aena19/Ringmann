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

  @Output() filterValueChangeEvent = new EventEmitter<string>

  url: string = 'assets/data/products.json';
  products!: Product[]
  flangeValues : string[] = []
  sizeValues : string[] = []
  //checkboxArray :string[][]= [[],[]]
  checkboxArray : [string[],boolean[]] = [[],[]]
  id:string=""
  selectedValues : string[] =[]
  selectedCount : number = 0
  priceRange : string[] = ["0-50","50-100","100-150","150-200","200-250","250-300"]

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
    var tempProducts : Product[]
    this.checkboxArray[0] = this.priceRange
    for(let i = 0; i < this.checkboxArray[0].length; i++){
      var tempcheckboxArray = this.checkboxArray[0][i].split('-')
      var minPrice = parseInt(tempcheckboxArray[0])
      var maxPrice = parseInt(tempcheckboxArray[1]) 

      tempProducts = this.products.filter(product => product.price > minPrice).filter(product => product.price < maxPrice)

      var priceRange : string = this.checkboxArray[0][i]
      var count : number = tempProducts.length

      this.checkboxArray[0][i] = this.checkboxArray[0][i] + " (" + count + ")" 

      for(let i = 0;i<this.checkboxArray[0].length;i++)
      {
        this.checkboxArray[1][i]= false
      }
    }
  }



  getFlangeValues(){
    for(let i = 0; i < this.products.length; i++){
      if(this.products[i].flange != null){
        for(let j = 0; j < this.products[i].flange.length; j++){
            this.flangeValues.push(this.products[i].flange[j])
        }
      }
    }
    this.checkboxArray[0] = this.flangeValues.filter(this.uniqueFilter)

    for (let i = 0; i < this.checkboxArray[0].length; i++){
      var flange : string = this.checkboxArray[0][i]
      var count : number = this.getCount(flange)

      this.checkboxArray[0][i] = this.flangeValues[i] + " (" + count + ")" 
    }

    for(let i = 0;i<this.checkboxArray[0].length;i++)
    {
      this.checkboxArray[1][i]= false
    }
  }

  getCount(key: string) {
    if(this.filterName === "Flange")
      return this.flangeValues.filter((curElem) => curElem == key).length
    else if(this.filterName === "Size(idxfdxh)")
      return this.sizeValues.filter((curElem) => curElem == key).length
    else
      return 0
    
  }

  getSizeValues() {
    for(let i = 0; i < this.products.length; i++){
      if(this.products[i].size != null){
        for(let j = 0; j < this.products[i].size.length; j++){
            this.sizeValues.push(this.products[i].size[j])
        }
      }
    }
    this.checkboxArray[0] = this.sizeValues.filter(this.uniqueFilter)
    for (let i = 0; i < this.checkboxArray[0].length; i++){
      var size : string = this.checkboxArray[0][i]
      var count : number = this.getCount(size)
      this.checkboxArray[0][i] = size + " (" + count + ")" 
    }
    for(let i = 0;i<this.checkboxArray[0].length;i++)
    {
      this.checkboxArray[1][i]= false
    }
  }

  uniqueFilter(value : string, index : number, self : string[]) {
    return self.indexOf(value) === index;
  }

  filterValueChanged(event : Event){
    // var selectedValue : string = (<HTMLInputElement>event.target).value

    // if((<HTMLInputElement>event.target).checked)
    //   this.selectedValues.push(selectedValue)
    // else
    //   this.selectedValues.splice(this.selectedValues.indexOf(selectedValue),1)
    // //console.log(<HTMLInputElement>event.target)
    
    // this.selectedCount=this.selectedValues.length
//     console.log(this.checkboxArray)
//     console.log(this.checkboxArray[0])
// console.log(this.checkboxArray.length)
// console.log(this.checkboxArray[0].length)
      this.selectedValues.length = 0
      for(let j = 0; j < this.checkboxArray[0].length; j++){
          	if(this.checkboxArray[1][j] == true){
               this.selectedValues.push(this.checkboxArray[0][j])
              }
      }
    
    this.selectedCount = this.checkboxArray[1].filter(this.getTrueCount).length
    this.filterValueChangeEvent.emit(this.selectedValues.toString() + ','+this.filterName)
  }

  getTrueCount(value : boolean){
    return value
  }

  reset(){
    this.selectedValues.length = 0
    this.selectedCount = 0
    for(let i = 0; i < this.checkboxArray[1].length; i++){
      this.checkboxArray[1][i] = false
    }
    this.filterValueChangeEvent.emit(this.selectedValues.toString() + ','+this.filterName)
  }

}
