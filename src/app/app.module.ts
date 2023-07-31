import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { HomeComponent } from './home/home.component';
import { TechnicalComponent } from './technical/technical.component';
import { ContactComponent } from './contact/contact.component';
import { BlogsComponent } from './blogs/blogs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SupportComponent } from './support/support.component';
import { LandingComponent } from './landing/landing.component';
import { CheckboxDropDownComponent } from './checkbox-dropdown/checkbox-dropdown.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';

const routes : Routes = [
  {path: '', redirectTo: '/home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  {path: 'technical/rp', component: TechnicalComponent},
  {path: 'technical/tsc', component: TechnicalComponent},
  {path: 'technical/tss', component: TechnicalComponent},
  {path: 'technical/cc', component: TechnicalComponent},
  {path: 'technical/tco', component: TechnicalComponent},
  {path: 'products', component: ProductsListComponent},
  {path: 'products/:id', component: ProductDetailComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'blogs', component: BlogsComponent},
  {path: '**', component: PageNotFoundComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailComponent,
    ProductsListComponent,
    ProductCardComponent,
    HomeComponent,
    ContactComponent,
    BlogsComponent,
    TechnicalComponent,
    PageNotFoundComponent,
    SupportComponent,
    LandingComponent,
    CheckboxDropDownComponent,
    PriceFilterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
