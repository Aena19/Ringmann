import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styleUrls: ['./technical.component.css']
})

export class TechnicalComponent {

  constructor(private route : ActivatedRoute){}
  submenu : string = ''

  ngOnInit(){
    this.submenu = this.route.snapshot.url[1].toString()
    console.log(this.submenu)
  }

}
