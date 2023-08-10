import { Component, Input } from '@angular/core';
import { Product } from 'src/assets/models/product.model';
import { ActivatedRoute,ParamMap, Router } from '@angular/router';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

@Input() product! : Product;
@Input() allSelectedFilters! : string
@Input() selectedProductIds !: string
constructor (private route : ActivatedRoute, private router : Router){}

goToProductDetail(){
  console.log('goToProductDetail')
  console.log(this.allSelectedFilters)
  var filter : string = ''
  this.route.paramMap.subscribe((params : ParamMap)=>{
    filter = (params.get('filter') || '')
    console.log(filter)
    console.log(params.get('filter'))

    if(params.get('filter') === null)
      this.router.navigate([String(this.product.id) + ('/') + (this.allSelectedFilters.replaceAll('/','^')) + '/' + (this.selectedProductIds)],{relativeTo : this.route})  
    else
      this.router.navigate([('../') + String(this.product.id) + ('/') + (this.allSelectedFilters.replaceAll('/','^')) + '/' + (this.selectedProductIds)],{relativeTo : this.route})  
  })


}
}
