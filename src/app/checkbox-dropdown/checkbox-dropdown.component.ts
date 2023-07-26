import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/assets/models/product.model';
import * as Products from 'src/assets/data/products.json'

@Component({
  selector: 'app-checkbox-dropdown',
  templateUrl: './checkbox-dropdown.component.html',
  styleUrls: ['./checkbox-dropdown.component.css']
})
export class CheckboxDropDownComponent {

  @Input() filterType : string = ""
  @Input() filterName : string = ""

  @Output() valueFilter = new EventEmitter<string>

  products!: Product[]
  flangeValues : string[] = []
  sizeValues : string[] = []
  //checkboxArray :string[][]= [[],[]]
  checkboxArray : [string[],boolean[]] = [[],[]]
  id:string=""
  selectedValues : string[] =[]
  selectedCount : number = 0

  // @HostListener('mousedown',['$event'])
  // closeDetails(){
  //   document.getElementById("flange")?.setAttribute("open","close")
  //   document.getElementById("size")?.setAttribute("open","close")
  //   //console.log()
  // }
  

  ngOnInit(){
    this.getProductsData()
    if(this.filterType === "F"){
      this.getFlangeValues()
      this.id = "flange"
    }
    if(this.filterType === "S"){
      this.getSizeValues()
      this.id = "size"
    }
      
    
  }

  getProductsData()
  {
    // return this.http.get(this.url).subscribe({
    //   next: (data) => {this.products = data as Product[];console.log("in getproductsdata from pro detail");console.log(this.products)},
    //   error:(error) => {console.log(error)}
    // })    
    this.products = (<any>Object).assign(new Product(),Products)
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
    if(this.filterType === "F")
      return this.flangeValues.filter((curElem) => curElem == key).length
    else
      return this.sizeValues.filter((curElem) => curElem == key).length
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

      this.checkboxArray[0][i] = this.sizeValues[i] + " (" + count + ")" 
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
    this.valueFilter.emit(this.selectedValues.toString() + ','+this.filterType)
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
    this.valueFilter.emit(this.selectedValues.toString() + ','+this.filterType)
  }

}
