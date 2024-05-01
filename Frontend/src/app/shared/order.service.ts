import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  formData! : Order;
  orderItems! : OrderItem[]
  
  constructor(private http : HttpClient) { }

  onSaveOrUpdate(){
    var body = {
      ...this.formData,
      OrderItems : this.orderItems
    }
    console.log(body)
    var url = 'https://localhost:44339/api/Order'
    return this.http.post(url,body)
  }


  getAllOrdersDetail(){
    var url = 'https://localhost:44339/api/Order'
    return this.http.get(url)
  }


}
