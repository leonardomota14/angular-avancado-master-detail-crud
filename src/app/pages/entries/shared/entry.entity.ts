import { EntryModel } from './entry.model';

export class EntryEntity {
  entry: EntryModel;
  
  static types = {
    expense: 'Despesa',
    reveneu: 'Receita'
  }
  
  get paidText(): string {
    return this.entry.paid ? 'Pago' : 'Pendente';
  }
}