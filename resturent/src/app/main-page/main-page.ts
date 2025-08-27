import { Component, signal } from '@angular/core';
import { AppStartRequests } from '../app-start-requests';
import { OnInit } from '@angular/core';
import { TablesAndItmes } from '../tables_and_items_holder';
import { NgFor,NgClass } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-main-page',
  imports: [NgFor,NgClass],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage implements OnInit {

  constructor(
    protected request:AppStartRequests,
    protected data_holder:TablesAndItmes,
    protected route:Router
  ){}

  ngOnInit(): void {
    
    this.request.get_tables().subscribe({
      next:(response) => {
        this.data_holder.items.set(response[1])
        this.data_holder.tables.set(response[0])
      },
      error(err) {
        console.log(err)
      },
    })
  }
  place_order_start(i:number,id:number){
    this.data_holder.order.set([this.data_holder.tables()[i].table_id]);
    if(this.data_holder.tables()[i].table_status == "free"){
        this.route.navigate(["/place_order"]);
    }else{
        this.route.navigate(["/see_order/"+id]);
    }
  }
  
  only_if_there_is_order(){
      this.route.navigate(["/place_order"])
  }
  go_to_login(){
    this.route.navigate(["/login"])
  }


}
