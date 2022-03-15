import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { EntryModel } from './entry.model'

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "http://localhost:3001/entries";  
  constructor(private http: HttpClient) { }

  getAll(): Observable<EntryModel[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntries)
    );
  } 

  getById(id: number): Observable<EntryModel> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(      
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    );
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    );
  }

  update(entry: EntryModel): Observable<EntryModel> {
    const url = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handlerError),
      map(() => entry)
    );
  }

  delete(id: number): Observable<EntryModel> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handlerError),
      map(() => null)
    );
  }

  private jsonDataToEntries(jsonData: any[]): EntryModel[] {
    const entries: EntryModel[] = [];
    jsonData.forEach(element => entries.push(element as EntryModel));
    return entries;
  }

  private jsonDataToEntry(jsonData: any): EntryModel {
    return jsonData as EntryModel;
  }

  private handlerError(error: any): Observable<any> {
    console.log('Erro na requisição ->', error);    
    return throwError(error);

  }

}
