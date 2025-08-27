import { Component } from '@angular/core';
import { TablesAndItmes } from '../tables_and_items_holder';
import { AppStartRequests } from '../app-start-requests';
import { Router,ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-see-placed-order',
  imports: [NgFor],
  templateUrl: './see-placed-order.html',
  styleUrl: './see-placed-order.css'
})
export class SeePlacedOrder implements OnInit {
  order_id:number |null = null;
  order:any = [];
  total_price = 0;
  constructor(
    protected table_and_item:TablesAndItmes,
    private request:AppStartRequests,
    private rout:Router,
    private router_url:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.order_id = Number(this.router_url.snapshot.paramMap.get("id"));
    this.request.get_order(this.order_id).subscribe({
      next:(response) => {
        console.log(response)
        this.order = response;
        console.log("this is order")
        console.log(this.order)
        for (let index = 0; index < this.order.order_details.length; index++) {
          this.total_price += this.order.order_details[index].item_price * this.order.order_details[index].item_amount 
        }
      },
      error(err) {
        console.log(err)
      },
    })
  }
  back_home(){
    this.rout.navigate(["/"]);
  }
change_status_of_order(data:{order_id:string,new_status:string,table_id:number}){
  this.request.change_order_Status(data).subscribe({
    next:(value) => {
      this.order.order.order_status = value
      if(typeof value == "string"){
        this.rout.navigate(["/"])
      }
    },
    error(err) {
      console.log(err)
    },
  })
}
add_items_to_order(table_id:number,order_id:number){
    this.table_and_item.new_items_for_order.set({table_id:table_id,order_id:order_id})
    this.rout.navigate(["/edit_order"]);
}

}
