import { CategoryService } from './../../categories/shared/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterContentChecked } from '@angular/core';

import { Entry } from './../shared/entry.model';
import { EntryService } from './../shared/entry.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { CategoryModel } from '../../categories/shared/category.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<CategoryModel>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousSandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(
    private service: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryform();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() { 
    this.setPageTitle();  
  }

  submitForm() {
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.createEntry();
    else
      this.updateEntry();
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new';
    else 
      this.currentAction = 'edit';
  }

  private buildEntryform() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if(this.currentAction == 'edit') 
    this.route.paramMap.pipe(
      switchMap(params => this.service.getById(+params.get('id')))
    ).subscribe(
      (entry) => {
        this.entry = entry;
        this.entryForm.patchValue(entry); //carregando os lançamentos para o formGroup
      },
      (error) => alert('Ocorreu um erro ao carregar os lançamentos!')
    );    
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categorires => this.categories = categorires
    );
  }

  private setPageTitle() {
    if(this.currentAction == 'new') 
      this.pageTitle = 'Cadastro de Novo Lançamento'
    else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editando lançamento: ${entryName}`;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(this.entryForm.value);
    this.service.create(entry).subscribe(
      ent => this.actionsForSuccess(ent),
      error => this.actionsForErrors(error)
    );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(this.entryForm.value);
    this.service.update(entry).subscribe(
      ent => this.actionsForSuccess(ent),
      error => this.actionsForErrors(error)
    );
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success('Solicitação processada com sucesso!');
    //redirect/reload component page
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
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
