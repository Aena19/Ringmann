import { Component,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css']
})
export class PriceFilterComponent {


  @Input() filterName : string = ""
  @Output() filterValueChangeEvent = new EventEmitter<string>

  priceRange : string[] = ["0-50","50-100","100-150","150-200","200-250","250-300"]

  priceRangeValue : string = ""

  priceRangeChanged(){
    //console.log(this.payTypeValue)
    this.filterValueChangeEvent.emit(this.priceRangeValue + ','+this.filterName)
  }

}
