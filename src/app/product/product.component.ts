import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  productForm: FormGroup;
  totalProducts = 0;
  pageSize = 10;
  errorMessage: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: [''],
      categoryId: [''],
    });
  }

  ngOnInit() {
    this.getCategories();
    this.getProducts(1);
  }

getCategories() {
  this.categoryService.getCategories().subscribe((data) => {
    this.categories = data.map((category: any, index: number) => ({
      index: index + 1, // Add a 1-based index
      id: category._id,
      name: category.name,
    }));
  });
}

  getProducts(page: number) {
    this.productService.getProducts(page, this.pageSize).subscribe((data) => {
      this.products = data.items.map((product: any, index: number) => ({
        index: (page - 1) * this.pageSize + index + 1,  
        id: product._id,
        name: product.name,
        categoryName: product.categoryId ? product.categoryId.name : 'Uncategorized',
      }));
      this.totalProducts = data.total;
    });
  }
  

  saveProduct() {
    const product = this.productForm.value;
    if (product.id) {
      this.productService.updateProduct(product.id, product).subscribe(() => this.getProducts(1));
    } else {
      this.productService.createProduct(product).subscribe(() => this.getProducts(1));
    }
    this.productForm.reset();
  }

  editProduct(product: any) {
    this.productForm.patchValue(product);
  }

  // deleteProduct(id: string) {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     this.productService.deleteProduct(id).subscribe(() => this.getProducts(1));
  //   }
  // }

  deleteProduct(id: string) {
    if (!id) {
      this.errorMessage = 'Invalid product ID. Unable to delete.';
      return;
    }
  
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          // Check if the current page has remaining products or move to the previous page
          const newPage = 
            this.products.length === 1 && this.paginator.pageIndex > 0 
            ? this.paginator.pageIndex 
            : this.paginator.pageIndex + 1;
  
          this.getProducts(newPage); // Refresh products
        },
        (error) => {
          this.errorMessage = 'Failed to delete product.';
          console.error('Error deleting product:', error);
        }
      );
    }
  }
  
  

  onPageChange(event: any) {
    this.getProducts(event.pageIndex + 1);
  }
}
