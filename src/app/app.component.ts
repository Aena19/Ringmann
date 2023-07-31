import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isMenuScrolled = false;

  @HostListener('window:scroll',['$event'])
  scrollCheck(){
    //console.log(pageYOffset)
    if(pageYOffset > 80)
      this.isMenuScrolled = true
    else
      this.isMenuScrolled = false
  }
  

}
