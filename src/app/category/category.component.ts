import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  errorMessage: string = ''; // Added error message for debugging

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [''],
    });
  }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data) => {
        // Map MongoDB `_id` to `id` and add a 1-based index
        this.categories = data.map((category: any, index: number) => ({
          index: index + 1, // Add sequential index
          id: category._id,
          name: category.name,
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load categories.';
        console.error('Error fetching categories:', error);
      }
    );
  }
  
  saveCategory() {
    const category = this.categoryForm.value;
    if (category.id) {
      // Update category
      this.categoryService.updateCategory(category.id, { name: category.name }).subscribe(
        () => this.getCategories(),
        (error) => {
          this.errorMessage = 'Failed to update category.';
          console.error('Error updating category:', error);
        }
      );
    } else {
      // Create new category
      this.categoryService.createCategory({ name: category.name }).subscribe(
        () => this.getCategories(),
        (error) => {
          this.errorMessage = 'Failed to create category.';
          console.error('Error creating category:', error);
        }
      );
    }
    this.categoryForm.reset();
  }

  editCategory(category: any) {
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id: string) {
    if (!id) {
      this.errorMessage = 'Invalid category ID. Unable to delete.';
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => this.getCategories(),
        (error) => {
          this.errorMessage = 'Failed to delete category.';
          console.error('Error deleting category:', error);
        }
      );
    }
  }
}
