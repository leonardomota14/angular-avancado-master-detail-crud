import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { environment } from 'src/environments/environment';
import { CategoryService } from './../../categories/shared/category.service';
import { EntryModel } from './entry.model'

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<EntryModel> {
 
  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ) {
    super(`${environment.REST_URL}/entries`, injector, EntryModel.fromJson)
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => { //usando flatMap para carregar a categoria dentro do lançamento para ser criado
        entry.category = category;
        
        return super.create(entry)        
      })
    )
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => { //usando flatMap para carregar a categoria dentro do lançamento para ser alterado
        entry.category = category;
        
        return super.update(entry);
      })
    );
  }  
}
