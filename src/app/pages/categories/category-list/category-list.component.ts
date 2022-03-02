import { Component, OnInit } from '@angular/core';

import { CategoryModel } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: CategoryModel[] = [];
  constructor( private service: CategoryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(categories => {
      this.categories = categories,
      () => alert('Erro ao carregar a lista de categorias!')      
    })
  }

  deleteCategory(category) {
    const mustDelete = confirm('Deseja realmente excluir essa categoria?')
    
    if(mustDelete){
      this.service.delete(category.id).subscribe(() => {
        this.categories = this.categories.filter(element => element != category);
        () => alert('Erro ao tentar excluir a categoria!')
      });
    }
  }

}
