import { BaseResourceListComponent } from './../../../shared/components/base-resource-list/base-resource-list.component';
import { Component} from '@angular/core';

import { EntryService } from './../shared/entry.service';
import { EntryModel } from './../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent extends BaseResourceListComponent<EntryModel> {

  constructor( private entryService: EntryService ) {
    super(entryService);
  }

}
