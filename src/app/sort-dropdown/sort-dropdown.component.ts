import { Component,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  styleUrls: ['./sort-dropdown.component.css']
})
export class SortDropdownComponent {

  @Output() sortOptionChangeEvent = new EventEmitter<number>

  sortOption : number = 1

  sortChanged(){
    console.log(this.sortOption)
    this.sortOptionChangeEvent.emit(this.sortOption)
  }
}
