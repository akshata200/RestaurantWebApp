import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private router : Router,
    private tostrService : ToastrService
  ){}

  ngOnInit() {
    this.refreshList();    
  }

  refreshList(){
    this.orderService.getAllOrdersDetail().subscribe(response=>{
      this.orderList = response
    });
  }


  UpdateOrderDetails(orderID : number){
    console.log("Update Order Details "+orderID)
    this.router.navigate(['/order/edit/'+orderID])
  }

  onOrderDelete(orderId : number){
    console.log("Delete Order "+orderId)
    if(confirm("DO you want to deleted this record?")){
      this.orderService.onDelete(orderId).subscribe(response=>{
        this.refreshList()
        this.tostrService.warning("Order deleted successfully","Restaurant App")
      })
    }
  }

}
