import { CategoryModel } from '../../categories/shared/category.model';

export interface EntryModel {
  id?:number,
  name?: string,
  description?: string,
  type?: string,
  amount?: string,
  date?: string,
  paid?: boolean,
  categoryId?: number,
  category?: CategoryModel
}