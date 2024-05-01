import { Target } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Item } from 'src/app/shared/item.model';
import { ItemService } from 'src/app/shared/item.service';
import { OrderItem } from 'src/app/shared/order-item.model';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styles: [
  ]
})
export class OrderItemsComponent implements OnInit{
  formData! : OrderItem;
  itemList! : Observable<Item[]>;
  // items !: Item[];
  allItems !: Item[];
  item !: Item;
  isValid : boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialougeRef : MatDialogRef<OrderItemsComponent>,
    public itemService : ItemService,
    private orderService : OrderService
  ){}


  ngOnInit(){
    this.itemList = this.itemService.getItemsList();

    if(this.data.orderItemIndex == null){
      this.formData = {
        OrderItemId: 0,
        OrderId : this.data.OrderID,
        ItemId : 0,
        ItemName : '',
        Price : 0,
        Quantity : 0,
        Total : 0
      }
      }else{
        this.formData = Object.assign({},this.orderService.orderItems[this.data.orderItemIndex]);
    }

  
  }

  updatePrice(event : any){
    if(event.selectedIndex == 0){
      this.formData.Price = 0;
      this.formData.ItemName = '';
      this.updateTotal();
      console.log(this.formData)
    }else{
      this.itemList.forEach(value =>{
        this.allItems = value as Item[];
        this.item = this.allItems[event.selectedIndex-1]
        this.formData.Price = this.item.price;
        this.formData.ItemName = this.item.name;
        this.updateTotal();
      })
    }
  }

  updateTotal(){
    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }

  onSubmit(form : NgForm){
    if(this.validateForm(form.value)){
      if(this.data.orderItemIndex == null)
        this.orderService.orderItems.push(form.value)
      else
        this.orderService.orderItems[this.data.orderItemIndex] = form.value
      this.dialougeRef.close();
    } 
  }

  validateForm(form : OrderItem){
    this.isValid = true;
    if(form.Quantity == 0)
      this.isValid = false
    else if(form.ItemId == 0)
      this.isValid = false
    return this.isValid
  }


}
