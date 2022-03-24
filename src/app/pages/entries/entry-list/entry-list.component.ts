import { Component, OnInit } from '@angular/core';

import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];
  constructor( private service: EntryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(
      entries => this.entries = entries.sort((a,b) => b.id - a.id),
      err => alert('Erro ao carregar a lista de entradas!') 
    )
  }

  deleteEntry(entry) {
    const mustDelete = confirm('Deseja realmente excluir essa entrada?')
    
    if(mustDelete){
      this.service.delete(entry.id).subscribe(() => {
        this.entries = this.entries.filter(element => element != entry);
        () => alert('Erro ao tentar excluir a entrada!')
      });
    }
  }

}
