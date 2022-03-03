import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';

import { CategoryModel } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: CategoryModel;

  constructor(
    private service: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryform();
    this.loadCategory();
  }

  ngAfterContentChecked() { 
    this.setPageTitle();  
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new';
    else 
      this.currentAction = 'edit';
  }

  private buildCategoryform() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required, Validators.minLength(2)],
      description: [null]
    });
  }

  private loadCategory() {
    if(this.currentAction == 'edit') 
    this.route.paramMap.pipe(
      switchMap(params => this.service.getById(+params.get('id')))
    ).subscribe(
      (category) => {
        this.category = category;
        this.categoryForm.patchValue(category); //carregando as categorias para o formGroup
      },
      (error) => alert('Ocorreu um erro ao carregar as categorias!')
    );    
  }

  private setPageTitle() {
    if(this.currentAction == 'new') 
      this.pageTitle = 'Cadastro de Nova Categoria'
    else {
      const categoryName = this.category.name || ' ';
      this.pageTitle = `Editando categoria: ${categoryName}`;
    }
  }

}
