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
  selector: 'app-items-for-order',
  imports: [NgIf,NgFor],
  templateUrl: './items-for-order.html',
  styleUrl: './items-for-order.css'
})
export class ItemsForOrder {
  constructor(
    protected data_holder:TablesAndItmes,
    private request:AppStartRequests,
    protected rout:Router){}

  get currentTableName(): string | undefined {
    const tableId = this.data_holder.order()[0];
    return this.data_holder.tables().find(t => t.table_id === tableId)?.table_name;
}
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
place_order(){
  this.request.place_order(this.data_holder.order()).subscribe({
    next:(response) => {
      if(response.status == true){
        this.rout.navigate(["/"])
      }
    },
    error:(err) => {
      console.log(err)
    }
  })
}
}
