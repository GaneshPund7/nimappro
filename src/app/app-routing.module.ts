import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: '', redirectTo: '/category', pathMatch: 'full' }, // Default route to Category
  { path: 'category', component: CategoryComponent },      // Route to Category Component
  { path: 'product', component: ProductComponent }         // Route to Product Component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
