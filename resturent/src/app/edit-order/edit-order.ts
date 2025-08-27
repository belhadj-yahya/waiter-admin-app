import { Component } from '@angular/core';
import { NgIf,NgFor } from '@angular/common';
import { TablesAndItmes } from '../tables_and_items_holder';
import { AppStartRequests } from '../app-start-requests';
import { Router } from '@angular/router';
interface item_for_order{
  item_id:number,
  item_name:string,
  descrption:string,
  item_price:number,
  item_amount?:number
}
@Component({
  selector: 'app-edit-order',
  imports: [NgIf,NgFor],
  templateUrl: './edit-order.html',
  styleUrl: './edit-order.css'
})
export class EditOrder{
constructor(
    protected data_holder:TablesAndItmes,
    private request:AppStartRequests,
    protected rout:Router){}
    go_back(){
    this.rout.navigate(["/"]);
  }
  in_order(id:number){
    return this.data_holder.order().find((el:item_for_order) => el.item_id === id);
  }
  display_order_item_amount(id:number){
    const name = this.data_holder.order().filter((el:item_for_order) => el.item_id === id);
    return name[0].item_amount;
  }
  add_item(item: item_for_order,amout:number) {
  this.data_holder.order.update(arr => {
    // look for existing item by id
    const existing = arr.find((el:item_for_order) => el.item_id === item.item_id);

    if (existing) {
      existing.item_amount = existing.item_amount + amout;
      if (existing.item_amount <= 0) {
        return arr.filter((el:item_for_order) => el.item_id !== item.item_id);
      }
      return [...arr]; 
    } else { 
      return [
        ...arr,
        {
          item_id: item.item_id,
          item_name: item.item_name,
          descrption: item.descrption,
          item_price: item.item_price,
          item_amount: 1,
        },
      ];
    }
  });
}
Edit_order(){
  const data_to_send = {
    order_and_table_id: this.data_holder.new_items_for_order(),
    new_order_stuff: this.data_holder.order()
  }
  this.request.edit_order(data_to_send).subscribe({
    next:(response) => {
      console.log(response)
      if(response.status == true){
        this.rout.navigate(["/see_order/"+response.order_id])
      }
    },
    error:(err) => {
      console.log(err)
    }
  })
}
}
