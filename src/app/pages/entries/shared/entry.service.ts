import { Injectable, Injector } from '@angular/core';
import * as moment from 'moment';
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
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  } 

  getByMonthAndYear(month: number, year: number): Observable<EntryModel[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }
  
  private setCategoryAndSendToServer(entry: EntryModel, sendFn: any): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => { //usando flatMap para carregar a categoria dentro do lançamento para ser criado
        entry.category = category;        
        return sendFn(entry)        
      }),
      catchError(this.handlerError)
    );
  }

  private filterByMonthAndYear(entries: EntryModel[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate.year() == year;

      if(monthMatches && yearMatches) return entry;
    })
  }
}
