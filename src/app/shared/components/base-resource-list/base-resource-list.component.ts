import { OnInit, Directive } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];
  constructor( protected resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      resource => this.resources = resource.sort((a,b) => b.id - a.id),
      err => alert('Erro ao carregar a lista de entradas!') 
    )
  }

  deleteResource(resource) {
    const mustDelete = confirm('Deseja realmente excluir este item?')
    
    if(mustDelete){
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert('Erro ao tentar excluir a entrada!')
      );
    }
  }

}
