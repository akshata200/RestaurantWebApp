import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: [
  ]
})
export class OrdersComponent implements OnInit{
  orderList : any;

  constructor(
    private orderService : OrderService,
  ){}

  ngOnInit() {
    var orderList;
    this.orderService.getAllOrdersDetail().subscribe(response=>{
      this.orderList = response
    });
    
  }

}
