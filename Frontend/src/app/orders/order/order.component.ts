import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/shared/order.model';
import { OrderItem } from 'src/app/shared/order-item.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: [
  ]
})
export class OrderComponent implements OnInit {

  allCustomer! : Customer[]
  isValid : boolean = true

  constructor(
      public service : OrderService,
      private dialouge : MatDialog,
      private customerService : CustomerService,
      private tostrService : ToastrService,
      private router : Router,
      private currRoute : ActivatedRoute
    )
  {}

  ngOnInit(){

    let orderId = this.currRoute.snapshot.paramMap.get("id");

    if(orderId == null)
      this.resetForm();
    else{
      this.service.getOrderById(parseInt(orderId)).subscribe((response: { order: Order; orderItems: OrderItem[]; })=>{
        this.service.formData = response.order;
        this.service.orderItems = response.orderItems;
        this.service.formData.DeletedOrderItems = ""
      })
    }


    //this.allCustomer = this.customerService.getAllCustomers();
    this.customerService.getAllCustomers().subscribe(response=>{
      this.allCustomer = response as Customer[]
    });

  }

  resetForm(form?: NgForm){
    if(form != null)
      form.resetForm();
    this.service.formData = {
      orderId: 0,
      orderNo: Math.floor(100000+Math.random()*900000).toString(),
      customerId : 0,
      paymentMethod : '',
      grandTotal : 0,
      DeletedOrderItems : ''
    }
    this.service.orderItems = []
  }

  AddOrEditOrderItem(orderItemIndex: any,OrderID: number){

    console.log("Order Items Component")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    //dialogConfig.position = { left: '30%', top:'-40%' }
    dialogConfig.data = {orderItemIndex,OrderID};
    this.dialouge.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(response=>{
      this.updateGrandTotal();
    });
  }

  onDeleteOrderItem(orderItemId : number, itemIndex:number){
    if(orderItemId != null){
      this.service.formData.DeletedOrderItems += orderItemId + ','
      console.log(this.service.formData.DeletedOrderItems)
    }
      
    this.service.orderItems.splice(itemIndex,1);
    this.updateGrandTotal();
  }

  onSubmit(form : NgForm){
    if(this.validateForm()){
      this.service.onSaveOrUpdate().subscribe(response=>{
        this.resetForm()
        this.tostrService.success("Submitted Successfully","Restaurant App")
        this.router.navigate(['/orders'])

      })
    }
    else{
      console.log("Form Not validated")
    }
  }

  updateGrandTotal(){
    var sum = 0;
    this.service.orderItems.forEach(element =>{
      sum+=element.total;
    })
    this.service.formData.grandTotal = parseFloat(sum.toFixed(2));
  }
  
  validateForm(){
    this.isValid = true
    if(this.service.formData.customerId ==0)
      this.isValid = false
    else if(this.service.formData.paymentMethod == '')
      this.isValid = false
    else if(this.service.orderItems.length == 0)
      this.isValid = false
    return this.isValid
  }


}
