import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService { 
    private apiUrl2 = 'http://localhost:3001/api/categories';
    // private apiUrl2 = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl2);
  }

  // Create a new category
  // createCategory(category: any): Observable<any> {
  //   return this.http.post(this.apiUrl, category);
  // }
  createCategory(category: { name: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl2, category);
  }
  // Update an existing category
  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl2}/${id}`, category);
  }

  // Delete a category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl2}/${id}`);
  }
}
