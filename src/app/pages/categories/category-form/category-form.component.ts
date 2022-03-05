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

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.createCategory();
    else
      this.updateCategory();
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
      name: [null, [Validators.required, Validators.minLength(2)]],
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
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando categoria: ${categoryName}`;
    }
  }

  private createCategory() {
    const category: CategoryModel = Object.assign(this.categoryForm.value);
    this.service.create(category).subscribe(
      cat => this.actionsForSuccess(cat),
      error => this.actionsForErrors(error)
    );
  }

  private updateCategory() {
    const category: CategoryModel = Object.assign(this.categoryForm.value);
    this.service.update(category).subscribe(
      cat => this.actionsForSuccess(cat),
      error => this.actionsForErrors(error)
    );
  }

  private actionsForSuccess(category: CategoryModel) {
    toastr.success('Solicitação processada com sucesso!');
    //redirect/reload component page
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionsForErrors(error: any) {
    toastr.error('Ocorreu um erro ao processar a solicitação!');
    this.submittingForm = false;
    if(error.status === 422) 
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else 
      this.serverErrorMessages = ['Falha ao comunicar com o servidor, por favor tente mais tarde.']
  }

}
