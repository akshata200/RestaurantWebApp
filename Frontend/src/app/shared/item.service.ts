import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Item } from './item.model';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private url = 'https://localhost:44339/api/Item';

  constructor(private client : HttpClient) { }

  getItemsList():Observable<any>{
    console.log(this.url);
   return this.client.get(this.url);
  }


}
