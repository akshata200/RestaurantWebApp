import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private url = 'https://localhost:44339/api/Customer'

  constructor(public http : HttpClient) { }

  getAllCustomers() : Observable<any>{
    return this.http.get(this.url)
  }

}
