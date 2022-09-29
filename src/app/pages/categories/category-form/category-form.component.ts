import { Component, Injector } from '@angular/core';
import {  Validators} from '@angular/forms';

import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';

import { CategoryModel } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<CategoryModel> {

  category: CategoryModel;

  constructor( protected categoryService: CategoryService,protected injector: Injector ) {
    super(injector, new CategoryModel(), categoryService, CategoryModel.fromJson);
  }

  protected buildResourceform() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected creationPageTitle(): string {
    return "Cadastro de Nova Categoria";
  }

  protected EditionPageTitle(): string {
    const resourceName = this.resource.name || "";
    return `Editando Categoria: ${resourceName}`;
  }
}
