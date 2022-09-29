import { Injectable, Injector } from '@angular/core';

import { environment } from './../../../../environments/environment';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

import { CategoryModel } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<CategoryModel> {
    
  constructor(protected injector: Injector) {
    super(`${environment.REST_URL}/categories`, injector, CategoryModel.fromJson);
  }
}
